let menu = {}

menu.getMenuList = function () {
  return [{
      "name": "sys",
      "title": "系统管理",
      "path": "/sys",
      "component": "Main",
      "icon": "ios-settings",
      "children": [{
          "name": "user-manage",
          "title": "用户管理",
          "path": "user-manage",
          "component": "sys/user-manage/userManage",
          "icon": "md-person",
          "children": null,
          "permTypes": ["add", "edit", "disable", "enable", "delete", "upload", "input"],
        },
        {
          "name": "gift-manage",
          "title": "礼品管理",
          "path": "gift-manage",
          "component": "sys/gift-manage/giftManage",
          "icon": "ios-bowtie",
          "children": null,
          "permTypes": ["add", "edit", "delete"],
        },
        {
          "name": "master-order-manage",
          "title": "主订单管理",
          "path": "master-order-manage",
          "component": "sys/master-order-manage/masterOrderManage",
          "icon": "md-film",
          "children": null,
          "permTypes": ["add"]
        },
        {
          "name": "salve-order-manage",
          "title": "子订单管理",
          "path": "salve-order-manage",
          "component": "sys/salve-order-manage/salveOrderManage",
          "icon": "ios-paper",
          "children": null,
          "permTypes": ["add"]
        },
        {
          "name": "user-apply-replenish",
          "title": "申请补发管理",
          "path": "user-apply-replenish",
          "component": "sys/user-apply-replenish/userApplyReplenish",
          "icon": "md-bus",
          "children": null,
          "permTypes": ["add"]
        },
        {
          "name": "express-fee",
          "title": "修改物流价格",
          "path": "express-fee",
          "component": "sys/express-fee/expressFee",
          "icon": "md-ionitron",
          "children": null,
          "permTypes": ["edit"]
        },
        {
          "name": "notice-manage",
          "title": "公告管理",
          "path": "notice-manage",
          "component": "sys/notice-manage/noticeManage",
          "icon": "md-notifications-outline",
          "children": null,
          "permTypes": ["add", "edit", "delete", "input"],
        },
        {
          "name": "addition-manage",
          "title": "用户申请管理",
          "path": "addition-manage",
          "component": "sys/addition-manage/additionManage",
          "icon": "logo-yen",
          "children": null,
          "permTypes": ["deal"],
        },

        // {
        //   "name": "department-manage",
        //   "title": "部门管理",
        //   "path": "department-manage",
        //   "component": "sys/department-manage/departmentManage",
        //   "icon": "md-git-branch",
        //   "permTypes": ["add", "edit", "delete"],
        //   "expand": true,
        //   "checked": false,
        //   "selected": false
        // },
        // {
        //   "name": "role-manage",
        //   "title": "角色权限管理",
        //   "path": "role-manage",
        //   "component": "sys/role-manage/roleManage",
        //   "icon": "md-contacts",
        //   "children": null,
        //   "permTypes": ["add", "edit", "delete", "editPerm", "setDefault"],
        //   "expand": true,
        //   "checked": false,
        //   "selected": false
        // }, {
        //   "name": "menu-manage",
        //   "title": "菜单权限管理",
        //   "path": "menu-manage",
        //   "component": "sys/menu-manage/menuManage",
        //   "icon": "md-menu",
        //   "children": null,
        //   "permTypes": ["add", "edit", "delete"],
        //   "expand": true,
        //   "checked": false,
        //   "selected": false
        // }
      ],
      "permTypes": null,
      "expand": true,
      "checked": false,
      "selected": false
    }, {
      "name": "monitor",
      "title": "系统监控",
      "path": "/monitor",
      "component": "Main",
      "icon": "ios-analytics",
      "children": [{
        "name": "quartz-job",
        "title": "定时任务",
        "path": "quartz-job",
        "component": "sys/quartz-manage/quartzManage",
        "icon": "md-time",
        "children": null,
        "permTypes": ["add", "edit", "disable", "enable", "delete"],
        "expand": true,
        "checked": false,
        "selected": false
      }, {
        "name": "log-manage",
        "title": "操作日志管理",
        "path": "log-manage",
        "component": "sys/log-manage/logManage",
        "icon": "md-list-box",
        "children": null,
        "permTypes": ["delete", "undefined"],
        "expand": true,
        "checked": false,
        "selected": false
      }, {
        "name": "druid",
        "title": "SQL监控",
        "path": "druid",
        "component": "sys/monitor/monitor",
        "icon": "md-analytics",
        "url": "http://192.168.1.190:8888/druid/login.html",
        "children": null,
        "permTypes": [],
        "expand": true,
        "checked": false,
        "selected": false
      }, {
        "name": "swagger",
        "title": "接口文档",
        "path": "swagger",
        "component": "sys/monitor/monitor",
        "icon": "md-document",
        "children": null,
        "permTypes": [],
        "expand": true,
        "checked": false,
        "selected": false
      }],
      "permTypes": null,
      "expand": true,
      "checked": false,
      "selected": false
    }
    // ,
    // {
    //   "name": "access",
    //   "title": "权限按钮测试页",
    //   "path": "/access",
    //   "component": "Main",
    //   "icon": "md-lock",
    //   "children": [{
    //     "name": "access_index",
    //     "title": "权限按钮测试页",
    //     "path": "index",
    //     "component": "access/access",
    //     "icon": "md-lock",
    //     "children": null,
    //     "permTypes": ["add", "edit", "delete"],
    //     "expand": true,
    //     "checked": false,
    //     "selected": false
    //   }],
    //   "permTypes": null,
    //   "expand": true,
    //   "checked": false,
    //   "selected": false
    // }
  ]
}

export default menu;