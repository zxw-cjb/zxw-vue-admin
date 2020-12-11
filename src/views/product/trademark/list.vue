<template>
  <div>
    <el-button type="primary" @click="visible = true" icon="el-icon-plus"
      >添加</el-button
    >

    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!-- {{ JSON.stringify(scope) }} -->
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
          <!-- <img class="trademark-img" src="./images/123.jpg" alt="logo" /> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="340">
        <template>
          <el-button icon="el-icon-edit" type="warning">修改</el-button>
          <el-button icon="el-icon-delete" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-pagination
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination> -->

    <!--
      $event 在DOM事件中代表 event
          <button @click="handle(123, $event)"></button>
            在自定义事件中代表 第一个参数
        <button @aaa="handle($event)"></button>
    -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>

    <!-- 添加品牌的样式 -->
    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--  第一种方法
            action="http://182.92.128.115/admin/product/fileUpload"
             -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { trademark } from "@api"; //不用这样引用，因为在main.js中把所有的接口都放到this.$API上了

export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      page: 1,
      limit: 3,
      total: 0,
      visible: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        //表单检验规则
        tmName: [
          {
            //必填项
            required: true,
            //错误信息
            message: "请输入品牌名称",
            //触发表单检验时机，离开焦点
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    // handleSizeChange(limit) {
    //   this.getPageList(this.page, limit);
    // }, //每页条数
    // handleCurrentChange(page) {
    //   this.getPageList(page, this.limit);
    // }, //单前页

    //提交表单
    submitForm(form) {
      //校验表单
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          // 表单校验通过
          // console.log(this.trademarkForm);
          //发送请求到服务器
          const result = await this.$API.trademark.addTrademark(
            this.trademarkForm
          );
          if (result.code === 200) {
            this.$message.success("添加数据成功");
            this.visible = false; //添加成功，关闭页面
            this.getPageList(this.page, this.limit); // 请求加载新数据
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },

    //上传图片成功的回调
    handleAvatarSuccess(res) {
      console.log(res.data); // 图片地址
      this.trademarkForm.logoUrl = res.data;
    },
    //上传图片之前触发的回调
    beforeAvatarUpload(file) {
      console.log(file);
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      //检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      //检测文件大小 file.size: 211493
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 50 kb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return isValidType && isLt;
    },
    async getPageList(page, limit) {
      try {
        const result = await this.$API.trademark.getPageList(page, limit);
        if (result.code === 200) {
          this.page = result.data.current; //代表单前页码
          this.limit = result.data.size; //代表每页显示的条数
          this.total = result.data.total; //总数
          this.trademarkList = result.data.records;
          this.$message.success("获取品牌分类列表成");
        } else {
          this.$message.error("获取品牌分类列表失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("获取品牌分页列表失败");
      }
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};

/*
  lang="less"
    完整写法
    深度选择器 /deep/
  lang="sass"
    可以省略 {}
    可以省略 ;
    深度选择器 /deep/  >>>
  lang="scss"
    完整写法

  lang="stylus"
    可以省略 {}
    可以省略 :
    可以省略 ;

  scoped
    让样式只在当前组件生效
    问题：加上scoped，会让设置的子组件样式失效
    解决：使用深度选择器
*/
</script>

<style lang="sass" scoped>
.trademark-img
  width: 100px,
  height: 60px
.trademark-pagination
  text-align: right
>>>.el-pagination__sizes
  margin-left: 250px
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
