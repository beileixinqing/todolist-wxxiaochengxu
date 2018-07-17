//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    currentObj:{},
    priorityItems:[
      {
        name:"无",
        checked:true
      },
      {
        name: "一般",
        checked: false
      },
      {
        name: "紧急",
        checked: false
      },
      {
        name: "特别紧急",
        checked: false
      },
    ],
    time:"",
    date:"",
    location:"",
    dateRange:[
      "永不",
      "每天",
      "每周",
      "每两周",
      "每月",
      "每年"
    ],
    dateRepeat:"",
    id:""
  },
  onLoad:function (options){
    let id = options.id;
    let that=this;
    that.setData({
      id:id
    })
    try {
      var todoLists = wx.getStorageSync('todoLists')
      todoLists.forEach(function (value, i) {
        if (value.id.toString() == id) {
          that.setData({
            currentObj: value
          })
        }
      })
      console.log(that.data.currentObj)
      if (that.data.currentObj.priority){
        that.data.priorityItems.forEach(function(value,i){
          that.data.priorityItems[i].checked = false;
          if (value.name === that.data.currentObj.priority){
            that.data.priorityItems[i].checked=true;
            that.setData({
              priorityItems:that.data.priorityItems
            })
          }
        })
      }
    } catch (e) {
      console.log("当前数据获取错误") 
    }
  },
  getInput: function (e) {
    let index = e.currentTarget.dataset.index;
    let currentInput = `todoLists[${index}].currentInput`;
    this.data.todoLists[index].currentInput = e.detail.value;
    this.setData({
      todoLists: this.data.todoLists
    })
    console.log(this.data.todoLists[index].currentInput)
  },
  dateSwitchChange: function (e) {
    var checked = e.detail.value;
    this.data.currentObj.dateStatus=checked;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  locationSwitchChange: function (e) {
    var checked = e.detail.value;
    this.data.currentObj.locationStatus = checked;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  priorityChange:function(e){
    var priority = e.detail.value;
    var priorityItems = this.data.priorityItems;
    for (var i = 0, len = priorityItems.length; i < len; ++i) {
      priorityItems[i].checked = priorityItems[i].name == e.detail.value;
    }
    this.setData({
      priorityItems: priorityItems
    });
  },
  bindDateRepeatChange:function(e){
    this.data.currentObj.dateRepeat = this.data.dateRange[e.detail.value];
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  bindTimeChange(e) {
    this.data.currentObj.time = e.detail.value;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  bindDateChange(e) {
    this.data.currentObj.date = e.detail.value;
    this.setData({
      currentObj: this.data.currentObj
    })
  },
  chooseLocation() {
    let that = this;
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        that.data.currentObj.location = res.name;
        that.setData({
          currentObj: that.data.currentObj
        })
      }
    })
  },
  saveDetail(e){
    let that = this;
    try {
      var todoLists = wx.getStorageSync('todoLists')
      todoLists.forEach(function (value, i) {
        if (value.id.toString() == that.data.id) {
          let tempObj = e.detail.value;
          tempObj.id=that.data.id;
          todoLists[i] = tempObj;
          wx.setStorageSync('todoLists', todoLists)
        }
      })
      console.log(todoLists)
      wx.redirectTo({      
        url: "/pages/todolist/todolist"
      })
    } catch (e) {  
      console.log(e)
      console.log("当前数据存储失败")
    }
  }
})
