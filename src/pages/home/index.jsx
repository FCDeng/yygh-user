import { Box, Typography, Button, Grid, TextField, Stack, Avatar } from '@mui/material'
import { useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect, Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Container from '@mui/material/Container'
import hospApi from '@/api/hosp/hospital'
import dictApi from '@/api/cmn/dict'
import { HospitalList } from '@/components'
import classes from './index.scss'
const Data = [
  {
    id: 1,
    hoscode: 10010,
    hosname: '香港玛丽医院',
    param: { hostypeString: '三甲' },
    bookingRule: {
      releaseTime: "8:00"
    }
  }
]
function HomePage() {

  useEffect(() => {
    getData()
    init()
  }, []);
  const navigate = useNavigate()
  const [list, setList] = useState(Data);
  const [name, setName] = useState('');
  const [searchObj, setSearchObj] = useState({});
  const [state, setState] = useState();
  const [hostypeList, setHostypeList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [listCache, setListCache] = useState([]);
  const [hostypeActiveIndex, setHostypeActiveIndex] = useState(0);
  const [provinceActiveIndex, setProvinceActiveIndex] = useState(0);
  const [page, setPage] = useState(1);

  const getData = () => {
    return hospApi.getPageList(1, 10, null).then(response => {
      setList(response.data.content)
      setListCache(response.data.content)
      setPage(response.data.totalPages)
    })
  }

  //查询医院等级列表 和 所有地区列表
  const init = () => {
    //查询医院等级列表
    dictApi.findByDictCode('Hostype').then(response => {
      //hostypeList清空
      const hostypeList = []
      //向hostypeList添加全部值
      hostypeList.push({ "name": "全部", "value": "" })
      //把接口返回数据，添加到hostypeList
      for (var i = 0; i < response.data.length; i++) {
        hostypeList.push(response.data[i])
      }
      setHostypeList(hostypeList)
    })
    //查询地区数据
    dictApi.findByDictCode('Beijin').then(response => {
      let districtList = []
      districtList.push({ "name": "全部", "value": "" })
      for (let i in response.data) {
        districtList.push(response.data[i])
      }
      setDistrictList(districtList)
    })
  }
  //查询医院列表
  const getList = () => {
    hospApi.getPageList(1, 10, searchObj).then(response => {
      const list = []
      for (let i in response.data.content) {
        list.push(response.data.content[i])
      }
      setList(list)
      setPage(response.data.totalPages)
    })
  }
  //根据医院等级查询
  const hostypeSelect = (hostype, index) => {
    setList([])
    setPage(1)
    setHostypeActiveIndex(index)
    setSearchObj(pre => ({ ...pre, hostype }))
    //调用查询医院列表方法
    getList()
  }
  //根据地区查询医院
  const districtSelect = (districtCode, index) => {
    setList([])
    setPage(1)
    setHostypeActiveIndex(index)
    setSearchObj(pre => ({ ...pre, districtCode }))
    //调用查询医院列表方法
    getList()
  }
  //在输入框输入值，弹出下拉框，显示相关内容
  const querySearchAsync = (queryString, cb) => {
    this.searchObj = []
    if (queryString == '') return
    hospApi.getByHosname(queryString).then(response => {
      for (let i = 0, len = response.data.length; i < len; i++) {
        response.data[i].value = response.data[i].hosname
      }
      cb(response.data)
    })
  }
  //在下拉框选择某一个内容，执行下面方法，跳转到详情页面中
  const handleSelect = (item) => {
    navigate(`./hospital?${item.hoscode}`)
  }
  //点击某个医院名称，跳转到详情页面中
  const show = (hoscode) => {
    navigate(`./hospital?${item.hoscode}`)
  }


  const user = useSelector((state) => {
    return state.user
  })

  const [dateRange, setDateRange] = useState([null, null])
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '' },
  })
  const onFormSubmit = (data) => {
    if (data.name == '') {
      setList(listCache)
    }
    let newList = listCache.filter(item => item.hosname.includes(data.name))
    setList(newList)
  }
  return (
    <Box className={classes.home}>
      <Box component="form" sx={{ px: 10, background: 'white', height: 60, mt: 2 }} onSubmit={handleSubmit(onFormSubmit)}>
        <Stack direction={'row'}>
          <TextField
            type="text"
            name="name"
            label={'点击输入医院名称'}
            fullWidth
            sx={{ mr: 2 }}
            {...register('name')}
          />
          <Button sx={{ pl: 2 }} type='submit' variant="contained" color="primary">搜索</Button>
        </Stack>
      </Box>
      <Stack sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }} >
        <Typography component={'h2'} sx={{ background: 'white', p: 2, fontWeight: "700" }} >医院</Typography>
        <HospitalList data={list} />
      </Stack>
    </Box>
  )
}

export default HomePage
