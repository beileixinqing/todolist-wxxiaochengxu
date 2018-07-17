//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    currentInput:"",
    currentEditInput: "",  
    todoLists:[],
    completedCount:0
  },
  save: function () {
    wx.setStorageSync('todoLists', this.data.todoLists)
  },
  load: function () {
    // wx.clearStorageSync()
    var todoLists = wx.getStorageSync('todoLists')
    if (todoLists) {
      var completedCount = todoLists.filter(function (item) {
        return item.completeStatus==true
      }).length      
      this.setData({ todoLists: todoLists, completedCount: completedCount })
    }
  },
  onLoad: function () {
    this.load()
  },
  tickToComplete:function(e){
    let index = e.currentTarget.dataset.index;   
    let completeStatus = `todoLists[${index}].completeStatus`;
    this.setData({
      [completeStatus]: !this.data.todoLists[index].completeStatus,
    }) 
    this.save();
    var completedCount = this.data.todoLists.filter(function (item) {
      return item.completeStatus == true
    }).length  
    this.setData({
      completedCount: completedCount
    }) 
  },
  getInput:function(e){
    let id = e.currentTarget.dataset.id;
    let that=this;
    that.setData({
      currentEditInput: e.detail.value,
    })
    that.data.todoLists.forEach(function (value, i) {
      if (value.id === id) {
        value.currentInput = that.data.currentEditInput;
      }
    })
    that.setData({
      todoLists: that.data.todoLists,
    })
    console.log(e.detail.value)
    that.save();
  },
  getAddInput: function (e) { 
    this.setData({
      currentInput: e.detail.value
    })
  },
  addListItem:function(e){
    if (!this.data.currentInput || !this.data.currentInput.trim()) return
    let that = this;
    let date = new Date();
    let listItemObj = {
      id: date.getTime(),
      date: "",
      time:"",
      location: "",
      priority: "",
      remark: "",
      dateStatus: false,
      locationStatus: false,
      dateRepeat: "永不",
      completeStatus: false,
      currentInput: this.data.currentInput
    }
    that.data.todoLists.push(listItemObj);
    that.setData({
      todoLists: that.data.todoLists,
      currentInput:""
    })
    this.save();   
  },
  editListItem: function (e) {
    let id = e.currentTarget.dataset.id;
    let that=this;
    that.data.todoLists.forEach(function(value,i){
      if(value.id===id){
        value.currentInput = that.data.currentEditInput;
      }
    })
    that.setData({
      todoLists: that.data.todoLists,
      currentInput: ""
    })
    that.save();
  },
  removeTodoHandle(e){
    var index = e.currentTarget.dataset.index
    var todoLists = this.data.todoLists
    var remove = todoLists.splice(index, 1)[0];
    this.setData({
      todoLists: todoLists
    })
    this.save();
    if (this.data.todoLists) {
      var completedCount = this.data.todoLists.filter(function (item) {
        return item.completeStatus == true
      }).length
      this.setData({ completedCount: completedCount })
    }
  }
})
