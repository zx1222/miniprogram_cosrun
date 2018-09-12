export default function getSystemInfo(){
      return new Promise((resolve, reject) => {
            wx.getSystemInfo({
                  success: function(res) {
                       resolve(res)
                  },
            })
      })
}