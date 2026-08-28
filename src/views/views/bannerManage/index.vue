<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="轮播标题"><el-input v-model="query.title" clearable placeholder="请输入标题" /></el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" clearable placeholder="全部">
          <el-option label="启用" :value="1" /><el-option label="停用" :value="0" />
        </el-select>
      </el-form-item>
      <el-button @click="resetQuery">重置</el-button>
      <el-button type="primary" @click="loadData">查询</el-button>
    </el-form>
    <el-button type="primary" size="small" @click="openForm()">新增轮播图</el-button>
    <el-table v-loading="loading" :data="list" style="margin-top:16px">
      <el-table-column prop="title" label="标题" min-width="150" />
      <el-table-column label="图片" width="100">
        <template slot-scope="{ row }"><image-preview :src="row.imageUrl" width="60px" height="45px" /></template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
      <el-table-column prop="sortNo" label="排序" width="80" align="center" />
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="{ row }"><el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '停用' }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="165" />
      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openForm(row)">编辑</el-button>
          <el-button type="text" class="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :current-page.sync="query.current" :page-size.sync="query.size" @pagination="loadData" />
    <el-dialog :title="form.id ? '编辑轮播图' : '新增轮播图'" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="标题" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="轮播图片" prop="imageUrl"><img-upload v-model="form.imageUrl" :limit="1" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortNo" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio :label="1">启用</el-radio><el-radio :label="0">停用</el-radio></el-radio-group></el-form-item>
      </el-form>
      <div slot="footer"><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">确定</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteBanner, pageBanner, saveBanner, updateBanner } from '@/api/banner'
import ImgUpload from '@/components/ImgUpload'
import ImagePreview from '@/components/ImagePreview'
import Pagination from '@/components/Pagination'

const emptyForm = () => ({ title: '', description: '', imageUrl: '', sortNo: 0, status: 1 })

export default {
  name: 'BannerManage',
  components: { ImgUpload, ImagePreview, Pagination },
  data() {
    return {
      loading: false, dialogVisible: false, list: [], total: 0,
      query: { current: 1, size: 10, title: '', status: undefined },
      form: emptyForm(),
      rules: { title: [{ required: true, message: '请输入标题', trigger: 'blur' }], imageUrl: [{ required: true, message: '请上传轮播图片', trigger: 'change' }] }
    }
  },
  created() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await pageBanner(this.query.current, this.query.size, { title: this.query.title, status: this.query.status })
        this.list = res.data.records || []
        this.total = res.data.total || 0
      } finally { this.loading = false }
    },
    resetQuery() { this.query = { current: 1, size: 10, title: '', status: undefined }; this.loadData() },
    openForm(row) { this.form = row ? { ...row } : emptyForm(); this.dialogVisible = true; this.$nextTick(() => this.$refs.form && this.$refs.form.clearValidate()) },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const data = { ...this.form, linkUrl: null }
        await (this.form.id ? updateBanner(data) : saveBanner(data))
        this.$message.success('保存成功'); this.dialogVisible = false; this.loadData()
      })
    },
    remove(row) {
      this.$confirm(`确认删除轮播图“${row.title}”吗？`, '提示', { type: 'warning' }).then(async() => {
        await deleteBanner(row.id); this.$message.success('删除成功'); this.loadData()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.danger { color: #f56c6c; }
</style>
