import { Component } from 'react'
import './app.less'
import Taro from "@tarojs/taro";
import {UserService} from "./service/UserService";

class App extends Component {



  componentWillReceiveProps (nextProps) {
  }
  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
