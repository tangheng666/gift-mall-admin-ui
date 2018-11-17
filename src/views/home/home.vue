<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>

<template>
    <div class="home-main">
        <Row :gutter="10">
            <i-col :md="24" :lg="8">
            <Row class-name="home-page-row1" :gutter="10">
                <i-col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                <Card>
                    <Row type="flex" class="user-infor">
                        <i-col span="8">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                            <img class="avator-img" :src="avatarPath" />
                        </Row>
                        </i-col>
                        <i-col span="16" style="padding-left:6px;">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                            <div>
                                <b class="card-user-infor-name">{{ username }}</b>
                                <p>MALL 欢迎您的使用</p>
                            </div>
                        </Row>
                        </i-col>
                    </Row>
                    <div class="line-gray"></div>
                    <Row class="margin-top-8">
                        <i-col span="8">
                        <p class="notwrap">本次登录地点:</p>
                        </i-col>
                        <i-col span="16" class="padding-left-8">{{city}}</i-col>
                    </Row>
                    <Row class="margin-top-8">
                        <i-col span="8">
                        <p class="notwrap">天气:</p>
                        </i-col>
                        <i-col span="16" class="padding-left-8">{{weather}}</i-col>
                    </Row>
                </Card>
                </i-col>
                <i-col :md="12" :lg="24" style="margin-bottom: 10px;">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="logo-github" size="20" style="margin-bottom:3px;" />
                     
                    </p>

                </Card>
                </i-col>
            </Row>
            </i-col>
            <i-col :md="24" :lg="16">
                <Row :gutter="5">
                    <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="user_created_count" :end-val="count.createUser" iconType="md-person-add" i-color="#2d8cf0" intro-text="今日新增用户"></infor-card>
                    </i-col>
                    <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="visit_count" :end-val="count.visit" iconType="ios-eye" i-color="#64d572" :iconSize="50" intro-text="今日浏览量"></infor-card>
                    </i-col>
                    <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="Collection_count" :end-val="count.Collection" iconType="md-cloud-upload" i-color="#ffd572" intro-text="今日数据采集量"></infor-card>
                    </i-col>
                    <i-col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card id-name="transfer_count" :end-val="count.transfer" iconType="md-shuffle" i-color="#f25e43" intro-text="今日服务调用量"></infor-card>
                    </i-col>
                </Row>
                <Row>
                    <i-col :md="24" :lg="12" style="padding: 0 0 10px 5px;" >
                        <Card>
                            <div id="comments" style="height:365px;overflow:auto;" class="inner-container"></div>
                        </Card>
                    </i-col>
                </Row>
            </i-col>
        </Row>
        <Row :gutter="10">
            <i-col :md="24" :lg="8" :style="{marginBottom: '10px'}">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="md-map"></Icon>
                    每日来访量统计
                </p>
                <div class="data-source-row">
                    <visite-volume></visite-volume>
                </div>
            </Card>
            </i-col>
            <i-col :md="24" :lg="16" :style="{marginBottom: '10px'}">
                <Card :padding="0">
                    <p slot="title" class="card-title">
                        <Icon type="md-locate"></Icon>
                        今日服务调用地理分布
                    </p>
                    <div class="map-con">
                        <i-col span="10">
                        <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                        </i-col>
                        <i-col span="14" class="map-incon">
                        <Row type="flex" justify="center" align="middle">
                            <home-map :city-data="cityData"></home-map>
                        </Row>
                        </i-col>
                    </div>
                </Card>
            </i-col>
        </Row>

    </div>
</template>

<script>
// import { ipInfo } from "@/api/index";
import cityData from "./map-data/get-city-value.js";
import homeMap from "./components/map.vue";
import visiteVolume from "./components/visiteVolume.vue";
import userFlow from "./components/userFlow.vue";
import countUp from "./components/countUp.vue";
import inforCard from "./components/inforCard.vue";
import mapDataTable from "./components/mapDataTable.vue";
import Cookies from "js-cookie";
import "gitalk/dist/gitalk.css";

export default {
  name: "home",
  components: {
    homeMap,
    visiteVolume,
    userFlow,
    countUp,
    inforCard,
    mapDataTable
  },
  data() {
    return {
      showVideo: false,
      count: {
        createUser: 496,
        visit: 3264,
        Collection: 24389305,
        transfer: 39503498
      },
      cityData: cityData,
      newToDoItemValue: "",
      city: "",
      weather: "",
      username: ""
    };
  },
  computed: {
    avatarPath() {
      return localStorage.avatorImgPath;
    }
  },
  methods: {
    init() {
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      this.username = userInfo.username;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
