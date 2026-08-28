<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form compact-filter" size="small">
        <el-form-item label="信息类型">
          <el-select
            v-model="queryParams.infoType"
            placeholder="请选择信息类型"
            clearable
          >
            <el-option
              :key="1"
              :label="'失物信息'"
              :value="1"
            />
            <el-option
              :key="2"
              :label="'招领信息'"
              :value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称">
          <el-input
            v-model="queryParams.itemName"
            placeholder="请输入物品名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="丢失或拾取地点">
          <el-input
            v-model="queryParams.occurPlace"
            placeholder="请输入丢失或拾取地点"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="丢失或拾取日期">
          <el-date-picker
            v-model="queryParams.occurDateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-select
            v-model="queryParams.isRecommend"
            placeholder="请选择是否推荐"
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
        <el-form-item label="审核状态">
          <el-select
            v-model="queryParams.auditStatus"
            placeholder="请选择审核状态"
            clearable
          >
            <el-option
              :key="0"
              :label="'待审核'"
              :value="0"
            />
            <el-option
              :key="1"
              :label="'审核通过'"
              :value="1"
            />
            <el-option
              :key="2"
              :label="'审核驳回'"
              :value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="信息状态">
          <el-select
            v-model="queryParams.publishStatus"
            placeholder="请选择信息状态"
            clearable
          >
            <el-option
              :key="0"
              :label="'已下架'"
              :value="0"
            />
            <el-option
              :key="1"
              :label="'寻找中'"
              :value="1"
            />
            <el-option
              :key="2"
              :label="'已匹配'"
              :value="2"
            />
            <el-option
              :key="3"
              :label="'已完成'"
              :value="3"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input
            v-model="queryParams.realName"
            placeholder="请输入学生姓名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input
            v-model="queryParams.categoryName"
            placeholder="请输入分类名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="管理员姓名">
          <el-input
            v-model="queryParams.realName2"
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
        :data="lostFoundInfoList"
        @selection-change="handleSelectionChange"
        class="modern-table"
      >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="信息编号(gen:LF)" prop="infoNo"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="信息类型" prop="infoType"  align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnumLabel(scope.row.infoType, infoTypeEnumMap) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物品名称" prop="itemName"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="物品封面" prop="coverImage" width="${c.width}" align="center">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.coverImage" :src="scope.row.coverImage" width="60px" height="60px" />
          <span v-else style="color: #909399;">暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="物品图片" prop="itemImages" width="${c.width}" align="center">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.itemImages" :src="scope.row.itemImages" width="60px" height="60px" />
          <span v-else style="color: #909399;">暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="丢失或拾取地点" prop="occurPlace"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="丢失或拾取日期" prop="occurDate"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="物品颜色" prop="itemColor"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="品牌或标识" prop="itemBrand"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="物品特征" prop="itemFeatures"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="物品描述" prop="description"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="联系人" prop="contactName"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="联系电话" prop="contactPhone"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="其他联系方式" prop="contactMethod"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="领取方式" prop="claimMethod"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="浏览次数" prop="viewCount"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="留言数量" prop="messageCount"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="匹配数量" prop="matchCount"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="是否推荐" prop="isRecommend"  align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnumLabel(scope.row.isRecommend, isRecommendEnumMap) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="auditStatus"  align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnumLabel(scope.row.auditStatus, auditStatusEnumMap) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" prop="auditRemark"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="信息状态" prop="publishStatus"  align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ getEnumLabel(scope.row.publishStatus, publishStatusEnumMap) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="学生姓名" prop="realName"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="分类名称" prop="categoryName"  align="center" :show-overflow-tooltip="true" />
      <el-table-column label="管理员姓名" prop="realName2"  align="center" :show-overflow-tooltip="true" />
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
    <el-dialog :title="title" :visible.sync="open"  width="600px"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="信息编号(gen:LF)" prop="infoNo">
          <el-input v-model="form.infoNo" placeholder="请输入信息编号(gen:LF)" />
        </el-form-item>
        <el-form-item label="发布学生" prop="studentId">
          <el-select v-model="form.studentId" placeholder="请选择发布学生" clearable style="width: 100%;">
            <el-option
              v-for="(item, idx) in studentUserOptions"
              :key="idx"
              :label="item.realName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="信息类型" prop="infoType">
          <el-radio-group v-model="form.infoType">
            <el-radio
              v-for="(item, index) in infoTypeOptions"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物品分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择物品分类" clearable style="width: 100%;">
            <el-option
              v-for="(item, idx) in itemCategoryOptions"
              :key="idx"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物品名称" />
        </el-form-item>
        <el-form-item label="物品封面" prop="coverImage">
          <img-upload v-model="form.coverImage" :limit="1" />
        </el-form-item>
        <el-form-item label="物品图片" prop="itemImages">
          <img-upload v-model="form.itemImages" :limit="1" />
        </el-form-item>
        <el-form-item label="丢失或拾取地点" prop="occurPlace">
          <el-input v-model="form.occurPlace" placeholder="请输入丢失或拾取地点" />
        </el-form-item>
        <el-form-item label="丢失或拾取日期" prop="occurDate">
          <el-input v-model="form.occurDate" placeholder="请输入丢失或拾取日期" />
        </el-form-item>
        <el-form-item label="物品颜色" prop="itemColor">
          <el-input v-model="form.itemColor" placeholder="请输入物品颜色" />
        </el-form-item>
        <el-form-item label="品牌或标识" prop="itemBrand">
          <el-input v-model="form.itemBrand" placeholder="请输入品牌或标识" />
        </el-form-item>
        <el-form-item label="物品特征" prop="itemFeatures">
          <el-input
            v-model="form.itemFeatures"
            type="textarea"
            :rows="3"
            placeholder="请输入物品特征"
          />
        </el-form-item>
        <el-form-item label="物品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入物品描述"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="其他联系方式" prop="contactMethod">
          <el-input v-model="form.contactMethod" placeholder="请输入其他联系方式" />
        </el-form-item>
        <el-form-item label="领取方式" prop="claimMethod">
          <el-input
            v-model="form.claimMethod"
            type="textarea"
            :rows="3"
            placeholder="请输入领取方式"
          />
        </el-form-item>
        <el-form-item label="浏览次数" prop="viewCount">
          <el-input v-model.number="form.viewCount" type="number" placeholder="请输入浏览次数" />
        </el-form-item>
        <el-form-item label="留言数量" prop="messageCount">
          <el-input v-model.number="form.messageCount" type="number" placeholder="请输入留言数量" />
        </el-form-item>
        <el-form-item label="匹配数量" prop="matchCount">
          <el-input v-model.number="form.matchCount" type="number" placeholder="请输入匹配数量" />
        </el-form-item>
        <el-form-item label="是否推荐" prop="isRecommend">
          <el-radio-group v-model="form.isRecommend">
            <el-radio
              v-for="(item, index) in isRecommendOptions"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态" clearable style="width: 100%;">
            <el-option
              v-for="(item, index) in auditStatusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核管理员" prop="auditAdminId">
          <el-select v-model="form.auditAdminId" placeholder="请选择审核管理员" clearable style="width: 100%;">
            <el-option
              v-for="(item, idx) in adminUserOptions"
              :key="idx"
              :label="item.realName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditRemark">
          <el-input
            v-model="form.auditRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核意见"
          />
        </el-form-item>
        <el-form-item label="信息状态" prop="publishStatus">
          <el-select v-model="form.publishStatus" placeholder="请选择信息状态" clearable style="width: 100%;">
            <el-option
              v-for="(item, index) in publishStatusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
  pageLostFoundInfo,
  getLostFoundInfoById,
  saveLostFoundInfo,
  updateLostFoundInfo,
  deleteLostFoundInfo,
  deleteBatchLostFoundInfo,
  listStudentUser,
  listItemCategory,
  listAdminUser

} from '@/api/lost_found_info'
import ImgUpload from '@/components/ImgUpload'
import ImagePreview from '@/components/ImagePreview'
import Pagination from '@/components/Pagination'
import BasicEditor from '@/components/BasicEditor'

export default {
  name: 'LostFoundInfo',
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
      lostFoundInfoList: [],
      title: '',
      open: false,
      queryParams: {
        current: 1,
        size: 5,
        infoType:  null,
        itemName:  null,
        occurPlace:  null,
        occurDateRange:  null,
        isRecommend:  null,
        auditStatus:  null,
        publishStatus:  null,
        realName:  null,
        categoryName:  null,
        realName2:  null
      },
      form: {},
      rules: {
        infoNo: [
          { required: true, message: '信息编号(gen:LF)不能为空', trigger: 'blur' }
        ],
        studentId: [
          { required: true, message: '发布学生不能为空', trigger: 'change' }
        ],
        infoType: [
          { required: true, message: '信息类型不能为空', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '物品分类不能为空', trigger: 'change' }
        ],
        itemName: [
          { required: true, message: '物品名称不能为空', trigger: 'blur' }
        ],
        coverImage: [
          { required: true, message: '物品封面不能为空', trigger: 'blur' }
        ],
        itemImages: [
          { required: true, message: '物品图片不能为空', trigger: 'blur' }
        ],
        occurPlace: [
          { required: true, message: '丢失或拾取地点不能为空', trigger: 'blur' }
        ],
        occurDate: [
          { required: true, message: '丢失或拾取日期不能为空', trigger: 'blur' }
        ],
        itemColor: [
          { required: true, message: '物品颜色不能为空', trigger: 'blur' }
        ],
        itemBrand: [
          { required: true, message: '品牌或标识不能为空', trigger: 'blur' }
        ],
        itemFeatures: [
          { required: true, message: '物品特征不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '物品描述不能为空', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        contactMethod: [
          { required: true, message: '其他联系方式不能为空', trigger: 'blur' }
        ],
        claimMethod: [
          { required: true, message: '领取方式不能为空', trigger: 'blur' }
        ],
        viewCount: [
          { required: true, message: '浏览次数不能为空', trigger: 'blur' }
        ],
        messageCount: [
          { required: true, message: '留言数量不能为空', trigger: 'blur' }
        ],
        matchCount: [
          { required: true, message: '匹配数量不能为空', trigger: 'blur' }
        ],
        isRecommend: [
          { required: true, message: '是否推荐不能为空', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '审核状态不能为空', trigger: 'change' }
        ],
        auditAdminId: [
          { required: true, message: '审核管理员不能为空', trigger: 'change' }
        ],
        auditRemark: [
          { required: true, message: '审核意见不能为空', trigger: 'blur' }
        ],
        publishStatus: [
          { required: true, message: '信息状态不能为空', trigger: 'change' }
        ]
      },
      studentUserOptions: [],
      itemCategoryOptions: [],
      adminUserOptions: []

,
      infoTypeOptions: [{value: 1, label: '失物信息'},{value: 2, label: '招领信息'}],
      isRecommendOptions: [{value: 0, label: '否'},{value: 1, label: '是'}],
      auditStatusOptions: [{value: 0, label: '待审核'},{value: 1, label: '审核通过'},{value: 2, label: '审核驳回'}],
      publishStatusOptions: [{value: 0, label: '已下架'},{value: 1, label: '寻找中'},{value: 2, label: '已匹配'},{value: 3, label: '已完成'}],

      infoTypeEnumMap: { 1: '失物信息', 2: '招领信息' },
      isRecommendEnumMap: { 0: '否', 1: '是' },
      auditStatusEnumMap: { 0: '待审核', 1: '审核通过', 2: '审核驳回' },
      publishStatusEnumMap: { 0: '已下架', 1: '寻找中', 2: '已匹配', 3: '已完成' },
    }
  },
  created() {
    this.getList()
    this.getStudentUserOptions({})
    this.getItemCategoryOptions({})
    this.getAdminUserOptions({})
  },
  methods: {
    /** 查询失物招领信息列表（范围查询绑定 xxxRange，传参拆成 xxxStart/xxxEnd） */
    getList() {
      this.loading = true
      const { current, size, ...rest } = this.queryParams
      const entity = { ...rest }
      // 范围字段不作为数组传参，拆成 start/end
      delete entity['occurDateRange']
      const _range0 = this.queryParams.occurDateRange
      entity['occurDateStart'] = _range0 && _range0[0] || null
      entity['occurDateEnd'] = _range0 && _range0[1] || null
      pageLostFoundInfo(current, size, entity).then(response => {
        const pageData = response.data
        this.lostFoundInfoList = pageData.records || []
        this.total = Number(pageData.total) || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 获取发布学生下拉选项 */
    getStudentUserOptions(params) {
      listStudentUser(params || {}).then(response => {
        this.studentUserOptions = response.data || []
      })
    },
    /** 获取物品分类下拉选项 */
    getItemCategoryOptions(params) {
      listItemCategory(params || {}).then(response => {
        this.itemCategoryOptions = response.data || []
      })
    },
    /** 获取审核管理员下拉选项 */
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
      this.queryParams.infoType = null
      this.queryParams.itemName = null
      this.queryParams.occurPlace = null
      this.queryParams.occurDateRange = null
      this.queryParams.isRecommend = null
      this.queryParams.auditStatus = null
      this.queryParams.publishStatus = null
      this.queryParams.realName = null
      this.queryParams.categoryName = null
      this.queryParams.realName2 = null
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
      this.title = '添加失物招领信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids[0]
      getLostFoundInfoById(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改失物招领信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLostFoundInfo(this.form).then(response => {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            saveLostFoundInfo(this.form).then(response => {
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
        return deleteLostFoundInfo(ids)
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
        return deleteBatchLostFoundInfo(ids)
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
