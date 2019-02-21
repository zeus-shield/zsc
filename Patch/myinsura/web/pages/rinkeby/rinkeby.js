Page({
  data:{
    id:""
  },
  onLoad:function(option){

    this.setData({
      id: option.id
    })

    console.log(this.data.id)
  }
  
})