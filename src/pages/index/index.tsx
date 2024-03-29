import {Button, Image, Text, View} from '@tarojs/components'
import './index.less'
import LunarCalendar from 'lunar-calendar'
import moment from 'moment'
import {useEffect, useState} from "react";
import Taro, {useDidShow, useShareAppMessage} from "@tarojs/taro";
import {UserService} from "../../service/UserService";
import {request} from './../../utils/request'
import {config} from './../../config'

const baseUrl = config.baseUrl
const Index = () =>{

  // const [isLogin,setIsLogin] = useState(false)

  const isLogin = Taro.getStorageSync('token')

  // 初始化方法
  function init(){
    Taro.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code,'code')
          // ###1.调用微信登录
          UserService.wxLogin({code:res.code}).then((checkIsHasUserRes:any)=>{
            console.log(checkIsHasUserRes,'checkIsHasUserRes')
            // 不管成没成功要先存 weappId ，后面注册要用到
            Taro.setStorageSync('weappId', checkIsHasUserRes.openid)
            if (checkIsHasUserRes.isHasUser){
              // 登录成功后先设置token
              Taro.setStorageSync('token', checkIsHasUserRes.token);
            } else {
              Taro.removeStorageSync('token');
            }
          })
        }
      }
    })
  }
  const weeks = ['一','二','三','四','五','六','日']
  const [imgUrl,setImgUrl] = useState('')
  const date = moment().date()
  const year = moment().year()
  const month = moment().month()
  console.log(year,month)
  const lcObj = LunarCalendar.calendar(year,month+1).monthData[date - 1]
  const [baseData,setBaseData] = useState<any>({
    date: moment().format('MM/DD'),
    week: `星期${weeks[(moment().format('E') - 1)]}`,
    lunarMonthDayName: `${lcObj.lunarMonthName}${lcObj.lunarDayName}`
  })
  const [punchers,setPunchers] = useState([])
  const [roData,setRoData] = useState({
    proposal: '',
    content: '',
    from: '',
    profession: '',
    author: '',
    authorOriginName: '',
    roData:'#000000'
  })
  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '单向历',
      path: '/pages/index/index'
    }
  })
  function genUrl(f: any): string {
    const { storageKey } = f
    const { postfix } = f
    return `http://public-api.rico.org.cn/${storageKey}.${postfix}`
  }
  useEffect(()=>{
    init()
  },[])
  useDidShow(() => {
    request({url:`${baseUrl}/calendar/ow`,data:{t:Math.random()}}).then(res=>{
      const params = {
        label:String(res.id),
        bucket:'qingkong-home'
      }
      request({url:'https://www.api.rico.org.cn/public-api/file/list',method:'POST',data:params}).then(resx=>{
        setImgUrl(genUrl(resx[0]))
      })
      setRoData(res)
      request({url:'https://www.api.rico.org.cn/purplelog/log',method:'POST',data:{
          "tags":["weapp"],
          "level":"info",
          "msg": JSON.stringify({
            origin:`${baseUrl}/calendar/ow`,
            req:res.id,
            res:res
          })
        }}).then(resxx=>{
        console.log(resxx)
      })
    })
    request({url:`${baseUrl}/punch/recordPunch`,method:'POST'}).then(xxxx=>{
      request({url:`${baseUrl}/punch/todayPunch`,method:'POST'}).then(resxc=>{
        console.log(resxc)
        setPunchers(resxc)
      })
    })
  })
  return (
    <View className='home'>
      <View className='date'>{baseData.date}</View>
      <View className='date-detail'>
        <View className='l'>
          <View className='yuan'></View>
          <View>{baseData.week} 农历 {baseData.lunarMonthDayName}</View>
        </View>
        <View className='r'>
          <View>{lcObj.GanZhiYear} 【{lcObj.zodiac}年】{lcObj.GanZhiMonth}月{lcObj.GanZhiDay}日</View>
          <View></View>
        </View>
      </View>
      <View className='bg-img' style={{backgroundImage:`url(${imgUrl})`,color: roData.background}}>
        <View className='content'>
          <View className='title'>{roData.proposal}</View>
          <Text className='desc'>{roData.content}</Text>
        </View>
        <View className='bottom'>
          <View className='chuchu'>{roData.from}</View>
          <View className='baixian'></View>
          <View className='zuozhe'>{roData.profession}，{roData.author}</View>
          <View className='en-name'>{roData.authorOriginName}</View>
        </View>
      </View>
      <View className={'looked'}>
        <View style={{color:'rgb(0,44,171)',fontSize:'12px'}}>今天看过的人</View>
        <View className={'punch-wrap'} onClick={()=>{
          Taro.navigateTo({
            url: '/pages/Looks/index'
          })
        }}>
          {
            punchers.filter((item,index)=>index<40).map(item=>{
              return <View className={'punch-item'}>
                {/*<Text>{item.puncherNickName}</Text>*/}
                <Image src={item.puncherAvatarUrl}/>
              </View>
            })
          }
        </View>
        {/*<View className={'tips'}>*/}
        {/*  <View>Tips：</View>*/}
        {/*  <View>1.点击头像可查看详细</View>*/}
        {/*  <View>2.点击获取头像昵称让我们知道你来过</View>*/}
        {/*</View>*/}
      </View>
      <View className='operate'>
        <Button className='btn' onClick={()=>{
          Taro.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log(res)
              UserService.wxCreateAndUpdate({
                weappId:Taro.getStorageSync('weappId'),
                userInfo:res.userInfo
              }).then(wxCreateAndUpdateRes=>{
                Taro.navigateTo({
                  url: '/pages/index/index'
                })
              })
            }
          })
        }}
        >{isLogin?'重新获取':'获取头像昵称'}</Button>
        <Button className='btn' openType='share'>分享</Button>
      </View>
    </View>
  )
}


export default Index
