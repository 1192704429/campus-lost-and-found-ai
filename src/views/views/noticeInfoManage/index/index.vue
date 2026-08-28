<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form" size="small">
        <el-form-item label="公告标题">
          <el-input
            v-model="queryParams.noticeTitle"
            placeholder="请输入公告标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select
            v-model="queryParams.noticeType"
            placeholder="请选择公告类型"
            clearable
          >
            <el-option
              :key="1"
              :label="'系统公告'"
              :value="1"
            />
            <el-option
              :key="2"
              :label="'失物提醒'"
              :value="2"
            />
            <el-option
              :key="3"
              :label="'招领提醒'"
              :value="3"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-select
            v-model="queryParams.isTop"
            placeholder="请选择是否置顶"
            clearable
          >
            <el-option
              :key="0"
              :label="'否'"
              :value="0"
            />
            <el-option
              :key="1"
              :label="'是'"
              :value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择发布状态"
            clearable
          >
            <el-option
              :key="0"
              :label="'未发布'"
              :value="0"
            />
            <el-option
              :key="1"
              :label="'已发布'"
              :value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="管理员姓名">
          <el-input
            v-model="queryParams.realName"
            placeholder="请输入管理员姓名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item class="search-buttons">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleAdd">新建</el-button>
      <el-button :disabled="multiple" @click="handleDeleteBatch">批量删除</el-button>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="noticeInfoList"
        @selection-change="handleSelectionChange"
        class="modern-table"
      >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="公告标题" prop="noticeTitle"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="公告类型" prop="noticeType"  align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnumLabel(scope.row.noticeType, noticeTypeEnumMap) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告正文" prop="noticeContent"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="公告封面" prop="coverImage" width="${c.width}" align="center">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.coverImage" :src="scope.row.coverImage" width="60px" height="60px" />
          <span v-else style="color: #909399;">暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="是否置顶" prop="isTop"  align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnumLabel(scope.row.isTop, isTopEnumMap) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" prop="status"  align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnumLabel(scope.row.status, statusEnumMap) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览次数" prop="viewCount"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="管理员姓名" prop="realName"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            style="color: #f56c6c;"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <pagination
      :total="total"
      :current-page.sync="queryParams.current"
      :page-size.sync="queryParams.size"
      :page-sizes="[5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加或修改对话框（有富文本/MD 时宽度 50%，否则 600px） -->
    <el-dialog :title="title" :visible.sync="open"  width="50%"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="发布管理员" prop="adminId">
          <el-select v-model="form.adminId" placeholder="请选择发布管理员" clearable style="width: 100%;">
            <el-option
              v-for="(item, idx) in adminUserOptions"
              :key="idx"
              :label="item.realName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="公告类型" prop="noticeType">
          <el-select v-model="form.noticeType" placeholder="请选择公告类型" clearable style="width: 100%;">
            <el-option
              v-for="(item, index) in noticeTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公告封面" prop="coverImage">
          <img-upload v-model="form.coverImage" :limit="1" />
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-radio-group v-model="form.isTop">
            <el-radio
              v-for="(item, index) in isTopOptions"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="(item, index) in statusOptions"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="浏览次数" prop="viewCount">
          <el-input v-model.number="form.viewCount" type="number" placeholder="请输入浏览次数" />
        </el-form-item>
        <el-form-item label="公告正文" prop="noticeContent">
          <el-input
            v-model="form.noticeContent"
            type="textarea"
            :rows="4"
            placeholder="请输入公告正文"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  pageNoticeInfo,
  getNoticeInfoById,
  saveNoticeInfo,
  updateNoticeInfo,
  deleteNoticeInfo,
  deleteBatchNoticeInfo,
  listAdminUser

} from '@/api/notice_info'
import ImgUpload from '@/components/ImgUpload'
import ImagePreview from '@/components/ImagePreview'
import Pagination from '@/components/Pagination'
import BasicEditor from '@/components/BasicEditor'

export default {
  name: 'NoticeInfo',
  components: {
    ImgUpload,
    ImagePreview,
    Pagination,
    BasicEditor
  },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      noticeInfoList: [],
      title: '',
      open: false,
      queryParams: {
        current: 1,
        size: 5,
        noticeTitle:  null,
        noticeType:  null,
        isTop:  null,
        status:  null,
        realName:  null
      },
      form: {},
      rules: {
        adminId: [
          { required: true, message: '发布管理员不能为空', trigger: 'change' }
        ],
        noticeTitle: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '公告类型不能为空', trigger: 'change' }
        ],
        coverImage: [
          { required: true, message: '公告封面不能为空', trigger: 'blur' }
        ],
        isTop: [
          { required: true, message: '是否置顶不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '发布状态不能为空', trigger: 'change' }
        ],
        viewCount: [
          { required: true, message: '浏览次数不能为空', trigger: 'blur' }
        ],
        noticeContent: [
          { required: true, message: '公告正文不能为空', trigger: 'blur' }
        ]
      },
      adminUserOptions: []

,
      noticeTypeOptions: [{value: 1, label: '系统公告'},{value: 2, label: '失物提醒'},{value: 3, label: '招领提醒'}],
      isTopOptions: [{value: 0, label: '否'},{value: 1, label: '是'}],
      statusOptions: [{value: 0, label: '未发布'},{value: 1, label: '已发布'}],

      noticeTypeEnumMap: { 1: '系统公告', 2: '失物提醒', 3: '招领提醒' },
      isTopEnumMap: { 0: '否', 1: '是' },
      statusEnumMap: { 0: '未发布', 1: '已发布' },
    }
  },
  created() {
    this.getList()
    this.getAdminUserOptions({})
  },
  methods: {
    /** 查询校园公告列表（范围查询绑定 xxxRange，传参拆成 xxxStart/xxxEnd） */
    getList() {
      this.loading = true
      const { current, size, ...rest } = this.queryParams
      const entity = { ...rest }
      pageNoticeInfo(current, size, entity).then(response => {
        const pageData = response.data
        this.noticeInfoList = pageData.records || []
        this.total = Number(pageData.total) || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 获取发布管理员下拉选项 */
    getAdminUserOptions(params) {
      listAdminUser(params || {}).then(response => {
        this.adminUserOptions = response.data || []
      })
    },
    /** 枚举列展示：根据 value 取 label，无则显示原值 */
    getEnumLabel(val, map) {
      if (map == null || map[val] === undefined) return val
      return map[val]
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 表单重置 */
    reset() {
      this.form = {}
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.current = 1
      this.queryParams.size = this.queryParams.size || 5
      this.queryParams.noticeTitle = null
      this.queryParams.noticeType = null
      this.queryParams.isTop = null
      this.queryParams.status = null
      this.queryParams.realName = null
      this.handleQuery()
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加校园公告'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids[0]
      getNoticeInfoById(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改校园公告'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNoticeInfo(this.form).then(response => {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            saveNoticeInfo(this.form).then(response => {
              this.$message.success('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteNoticeInfo(ids)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    /** 批量删除按钮操作 */
    handleDeleteBatch() {
      const ids = this.ids
      this.$confirm('是否确认删除选中的' + ids.length + '条数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteBatchNoticeInfo(ids)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    /** 分页大小改变 */
    handleSizeChange(val) {
      this.queryParams.size = val
      this.queryParams.current = 1
      this.getList()
    },
    /** 当前页改变 */
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
