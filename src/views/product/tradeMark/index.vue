<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="show">添加</el-button>

    <!-- 表格
      data:表格组件将来需要展示的数据
      prop:对应列内容的字段名
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width: 50px; height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="row" label="操作">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="edit(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
      page-sizes:可以设置每一页展示多少条数据
      pager-count:页码按钮的数量
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
     -->
    <el-pagination style="text-align: center; margin-top: 20px"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 6, 9]"
      :pager-count="5"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>

    <!-- 嵌套表单的对话框
      visible.sync:是否显示对话框
     -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- 表单 
        model:表单数据对象，把表单的数据收集到tmForm这个对象身上，将来表单验证，也需要这个属性
        Form组件提供了表单验证的功能，只需要通过rules属性传入约定的验证规则，并将Form-Item的prop属性设置为需校验的字段名即可
      -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片
            这里收集数据：不能使用v-model，因为不是表单元素
            action:设置图片上传的地址
            on-success:图片上传成功后的回调
            before-upload:图片上传之前的回调
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    // 自定义校验规则
    const validateTmName = (rule, value, callback) => {
      if (value.length > 2 && value.length < 8) {
        return callback()
      } else {
        return callback(new Error('长度在 2 到 8 个字符'))
      }
    }
    return {
      page: 1, // 当前页
      limit: 3, // 每页的数据个数
      total: 0, // 一共多少条数据
      list: [], // 数据列表
      dialogFormVisible: false, // 不显示对话框
      tmForm: { tmName: '', logoUrl: '' }, // 收集品牌信息，对象身上的属性，不能瞎写，需要看文档
      // 表单校验规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
          // 自定义校验规则
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌管理列表数据
    async getPageList() {
      const { page, limit } = this
      let result = await this.$API.trademark.reqTradeMark(page, limit)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 当分页器页码改变时触发
    handleCurrentChange(changePage) {
      this.page = changePage
      this.getPageList()
    },
    // 当分页器一页展示的数据条数发生变化时触发
    handleSizeChange(changeLimit) {
      this.limit = changeLimit
      this.getPageList()
    },
    // 点击添加按钮
    show() {
      // 显示对话框
      this.dialogFormVisible = true
      // 防止填写品牌名称和LOGO，点击对话框取消按钮后，再次点击添加按钮品牌名称和LOGO还在
      // 再次点击添加按钮清除品牌名称和LOGO
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 点击修改按钮的回调，参数为每一行的商品属性
    edit(row) {
      this.dialogFormVisible = true
      // 进行修改的商品的名称和LOGO要显示在对话框中
      // 浅拷贝，不能直接将row赋值给tmForm
      this.tmForm = {...row}
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res) {
      // res:图片上传成功后返回前端的数据
      // 收集品牌LOGO图片数据，因为以后需要带给服务器
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M;
    },
    // 点击对话框确定按钮的回调(添加品牌||修改品牌)
    addOrUpdateTradeMark() {
      // 判断校验规则是否通过，如果通过valid为true，反之为false
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false
          // 发请求，如果参数有商品id，表示要修改品牌，反之表示添加品牌
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            this.$message({
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
              type: 'success'
            })
            this.getPageList()
          }
        }
      })
    },
    // 点击删除按钮的回调
    remove(row) {
      // 点击删除按钮出现MessageBox弹框
      this.$confirm(`确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发请求删除品牌
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 当某一页数据个数小于1时，要更改当前页（变为上一页），否则会没有数据；当数据个数大于1，则不用更改当前页
          // 为什么this.list.length要减1？因为删除前this.list没有更新（重新发送请求获取数据后才会更新）
          // console.log(this.list.length)
          if (this.list.length - 1 < 1) {
            this.page--
            this.getPageList()
          } else {
            this.getPageList()
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })        
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>