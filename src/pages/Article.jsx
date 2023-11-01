import { LikeOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import {
  Select,
  Avatar,
  List,
  Space,
  Pagination,
  Input,
  Radio,
  ConfigProvider,
} from 'antd'
import avatar0 from '../static/img/0.jpg'
import axios from 'axios'
import articleimg from '../static/img/loading.gif'
import { Link } from 'react-router-dom'

const { Search } = Input

const Article = () => {
  const [ori_articles, setOri_articles] = useState([])
  const [articles, setArticles] = useState([])
  const [tops, setTops] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortValue, setSortValue] = useState()
  const [groupvalue, setGroupvalue] = useState(0)

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  )

  //date日期格式化
  function formatDate(inputDate) {
    const date = new Date(inputDate) //格式化date
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
  }

  //radio类别函数
  function cate(category) {
    switch (category) {
      case '1':
        return '协会动态'
      case '2':
        return '学习研习'
      case '3':
        return '工作相关'
      case '4':
        return '谈天说地'
    }
  }

  useEffect(() => {
    handleChange('newest')
    const fetchdata = async () => {
      const type = 0
      const res = await axios.get(`/art/${0}/${type}`)
      console.log(res.data)

      // // 降序排序
      // tempPhotos.sort((a, b) => {
      //   const dateA = new Date(a.date)
      //   const dateB = new Date(b.date)
      //   return dateB - dateA
      // })
      //文章数据
      console.log(res.data)
      const artdataPromises = res.data.map(async (item, index) => {
        var avatarimg
        var coverimg
        //文章所属作者头像
        if (item.user_img == '0') {
          avatarimg = avatar0
        } else {
          const avatar_image = await axios.get(
            `/image/${item.user_img}?userid=${item.user_id}`,
            {
              responseType: 'blob', // 设置响应类型为 Blob
            }
          )
          avatarimg = URL.createObjectURL(avatar_image.data)
        }
        //文章图片
        if (item.img) {
          const photo_image = await axios.get(
            `/article_photo/${item.img}?userid=${item.user_id}`,
            {
              responseType: 'blob', // 设置响应类型为 Blob
            }
          )
          coverimg = URL.createObjectURL(photo_image.data)
        } else {
          coverimg = articleimg
        }
        const likesnum = item.likes ? JSON.parse(item.likes).length : 0
        console.log(likesnum)
        return {
          id: `${item.id}`,
          user_uuid: `${item.user_uuid}`,
          date: `${item.post_date}`,
          title: `${item.title}`,
          avatar_img: avatarimg,
          cover_img: coverimg,
          photo_index: index,
          topdescription: `${item.user_name}`,
          category: `${cate(item.category)}`,
          description: `${item.user_name} | ${item.user_major} | ${formatDate(
            item.post_date
          )} | ${cate(item.category)}`,
          content: `${item.content}`,
          likesnum: `${likesnum}`,
          comments: `${item.comments}`,
          readings: `${Math.floor(item.readings / 2)}`,
        }
      })
      // 上面的map函数内部的异步操作会导致整个 map 返回的是 Promise 数组，而不是包含实际数据的数组
      // 需要使用Promise.all等待所有Promise完成
      const artdata = await Promise.all(artdataPromises)
      const articles_data = await Promise.all(
        artdata.sort((a, b) => new Date(b.date) - new Date(a.date))
      )
      console.log(articles_data)
      setArticles(articles_data)
      setOri_articles(artdata)
      setTops(artdata.sort((a, b) => b.readings - a.readings).slice(0, 5))

      const currentPage1Element = document.querySelector(
        '.ant-pagination-item-1'
      )
      if (currentPage == 1 && currentPage1Element) {
        console.log(333333)
        currentPage1Element.classList.add('ant-pagination-item-active')
      }
    }
    fetchdata()

    //页面有x轴时初始化居中
    const scrollContainer = document.querySelector('.container')
    if (scrollContainer) {
      const initialScrollLeft =
        (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2
      scrollContainer.scrollLeft = initialScrollLeft
    }
  }, [])

  // onChange 回调函数
  const handlePageChange = (page) => {
    setCurrentPage(page)
    const currentPage1Element = document.querySelector('.ant-pagination-item-1')
    if (page != 1 && currentPage1Element) {
      currentPage1Element.classList.remove('ant-pagination-item-active')
    }
  }

  const onSearch = (value) => {
    console.log(value)
  }

  const handleChange = async (value) => {
    setSortValue(value) //必须有这句才会渲染 不知道是为什么 sortValue并没有使用 有可能是需要在setArticles之前set一个才会识别 可是为什么？
    try {
      let new_articles
      switch (value) {
        case 'newest':
          new_articles = articles.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
          break
        case 'readsmost':
          new_articles = articles.sort((a, b) => b.readings - a.readings)
          break
        case 'likesmost':
          new_articles = articles.sort((a, b) => b.likesnum - a.likesnum)
          break
        case 'commentsmost':
          new_articles = articles.sort((a, b) => b.comments - a.comments)
          break
        default:
          new_articles = articles.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
      }
      setArticles(new_articles)

      const currentPage1Element = document.querySelector(
        '.ant-pagination-item-1'
      )
      if (currentPage == 1 && currentPage1Element) {
        console.log(333333)
        currentPage1Element.classList.add('ant-pagination-item-active')
      }
    } catch (err) {
      console.log(err)
    }

    // { value: 'newest', label: '最新' },
    // { value: 'reads', label: '阅读数最多' },
    // { value: 'likes', label: '点赞最多' },
    // { value: 'conments', label: '评论最多' },
  }

  const GrouponChange = async (e) => {
    setGroupvalue(e.target.value)
    console.log(e.target.value)
    console.log(ori_articles)
    try {
      let new_articles
      switch (e.target.value) {
        case 1:
          new_articles = ori_articles.filter(
            (item) => item.category == '协会动态'
          )
          break
        case 2:
          new_articles = ori_articles.filter(
            (item) => item.category == '学习研习'
          )
          break
        case 3:
          new_articles = ori_articles.filter(
            (item) => item.category == '工作相关'
          )
          break
        case 4:
          new_articles = ori_articles.filter(
            (item) => item.category == '谈天说地'
          )
          console.log(new_articles)
          break
        default:
          new_articles = ori_articles.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
      }
      setArticles(new_articles)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <ConfigProvider
      //antd主题色修改为迷彩绿
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#749946',
          borderRadius: 2,
        },
      }}>
      <div className="containerarticle">
        <div className="articlebigbox">
          <div className="articleheader">
            <span>协会文章</span>
          </div>
          <div className="articlebox">
            <div className="menu">
              <div className="otherarticle0">
                <p className="article_type">文章分类</p>
                <Radio.Group
                  onChange={GrouponChange}
                  value={groupvalue}
                  className="radiogroup"
                  defaultValue={0}>
                  <Space direction="vertical">
                    <Radio value={0}>全部文章</Radio>
                    <Radio value={1}>协会动态</Radio>
                    <Radio value={2}>学习研习</Radio>
                    <Radio value={3}>工作相关</Radio>
                    <Radio value={4}>谈天说地</Radio>
                  </Space>
                </Radio.Group>
              </div>
              <List
                header={<h3>热门文章 TOP5</h3>}
                itemLayout="horizontal"
                dataSource={tops}
                className="menulist"
                renderItem={(item, index) => (
                  <a href={`/singleart/${item.user_uuid}/${item.id}`}>
                    <List.Item>
                      <List.Item.Meta
                        title={<span className="s1">{item.title}</span>}
                        description={
                          <span className="s2">
                            {item.topdescription}
                            <span className="eye" style={{ float: 'right' }}>
                              <EyeOutlined /> {Math.floor(item.readings / 2)}
                            </span>
                          </span>
                        }
                      />
                    </List.Item>
                  </a>
                )}
              />
            </div>
            <div className="articles">
              <div className="contentheader">
                <Select
                  defaultValue="newest"
                  style={{ width: 160 }}
                  onChange={handleChange}
                  className="select"
                  options={[
                    { value: 'newest', label: '最新' },
                    { value: 'readsmost', label: '阅读最多' },
                    { value: 'likesmost', label: '点赞最多' },
                    { value: 'commentsmost', label: '评论最多' },
                  ]}
                />
                <Pagination
                  onChange={handlePageChange}
                  defaultCurrent={1}
                  pageSize={4}
                  total={articles ? articles.length : 0}
                  hideOnSinglePage={true}
                  className="pagination"
                />
                <div className="search">
                  <Search
                    placeholder="搜索姓名"
                    onSearch={onSearch}
                    enterButton
                  />
                </div>
              </div>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={
                  articles
                    ? articles.slice((currentPage - 1) * 4, currentPage * 4)
                    : []
                }
                renderItem={(item, index) => (
                  <Link to={`/singleart/${item.user_uuid}/${item.id}`}>
                    <List.Item
                      key={item.title}
                      actions={[
                        <IconText
                          icon={EyeOutlined}
                          text={item.readings}
                          key="list-vertical-like-o"
                        />,
                        <IconText
                          icon={LikeOutlined}
                          text={item.likesnum}
                          key="list-vertical-like-o"
                        />,
                        <IconText
                          icon={MessageOutlined}
                          text={
                            item.comments != null
                              ? JSON.parse(item.comments).comments_num
                              : '0'
                          }
                          key="list-vertical-message"
                        />,
                      ]}
                      extra={
                        <img width={272} alt="logo" src={item.cover_img} />
                      }>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar_img} />}
                        title={item.title}
                        description={item.description}
                      />
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </List.Item>
                  </Link>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Article
