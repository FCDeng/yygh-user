import { Box, Stack, Typography, Select, Button, TextField, FormControl, MenuItem, InputLabel, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import classes from './index.scss'
import cookie from 'js-cookie'
import LoginDialog from '@/components/LoginDialog';
import LabelIcon from '@mui/icons-material/Label';
import hospitalApi from '@/api/hosp/hospital'
import userInfoApi from '@/api/user/userInfo'
import orderInfoApi from '@/api/order/orderInfo'
import patientApi from '@/api/user/patient'
import Radio from '@mui/material/Radio';
import dictApi from '@/api/cmn/dict'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { message } from '@/components'
import Checkbox from '@mui/material/Checkbox';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
const OrderPage = () => {
    const [searchObj, setSearchObj] = useState({})
    const [list, setList] = useState([])
    const [patientList, setPatientList] = useState([{ id: 'aa', name: 'bb' }])
    const navigate = useNavigate()
    const [statusList, setStatusList] = useState([])
    const [patientName, setPatientName] = useState('')
    const [commentName, setCommentName] = useState('')
    useEffect(() => {
        fetchData()
        findPatientList()
        getStatusList()
    }, [])
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: { name: '', certificatesNo: '' },
    })

    const fetchData = () => {
        let patientId = ''
        let comment = ''
        if (patientName) {
            patientId = patientList.find(item => item.name == patientName).id
        }
        if (commentName) {
            comment = statusList.find(item => item.comment == commentName).status
        }
        orderInfoApi.getPageList(1, 40, { patientId, orderStatus: comment }).then(response => {
            let newList = response.data.records.map(item => ({
                ...item,
                orderStatusString: item.param.orderStatusString
            })).sort((a, b) => Date.parse(b.createTime) - Date.parse(a.createTime))
            setList(newList)
        })
    }
    const findPatientList = () => {
        patientApi.findList().then(response => {
            setPatientList(response.data)
        })
    }
    const getStatusList = () => {
        orderInfoApi.getStatusList().then(response => {
            setStatusList(response.data.filter(item => item.status != -1))
        })
    }

    const onFormSubmit = (data) => {
        console.log(data)
    }
    const getData = () => {

    }
    const handlePatientChange = (e) => {
        setPatientName(e.target.value)
    }
    const handleOrderChange = (e) => {
        setCommentName(e.target.value)
    }
    const goDetail = () => {
        navigate('')
    }
    const columns = [
        { field: 'reserveDate', headerName: '就诊时间', width: 100 },
        { field: 'hosname', headerName: '医院', width: 100 },
        { field: 'depname', headerName: '科室', width: 100 },
        { field: 'title', headerName: '医生', width: 100 },
        { field: 'amount', headerName: '医事服务费', width: 80 },
        { field: 'patientName', headerName: '患者', width: 100 },
        { field: 'orderStatusString', headerName: '订单状态', width: 160 },
        // { field: 'orderStatusString', headerName: '订单状态', width: 130, renderCell: () => <Typography>预约成功</Typography> },
        {
            field: 'action', headerName: '操作', width: 80,
            renderCell: () => <Button variant="contained" onClick={() => goDetail(row.id)}>详情</Button>
        },
    ]

    return <Stack className={classes.orderPage}
        spacing={4}
        sx={{ background: 'white', p: 2, boxSizing: 'border-box', overflow: 'hidden' }}>
        <Typography sx={{ fontWeight: 'bold' }}>挂号订单</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
            <Stack spacing={1} direction={'row'}>
                <FormControl sx={{ width: 800 }} >
                    <InputLabel id="patientId">请选择患者</InputLabel>
                    <Select
                        labelId="patientId"
                        id="patientId"
                        // value={patientName}
                        label="请选择患者"
                        onChange={handlePatientChange}
                        name='patientName'
                    >
                        {patientList.map(item => (<MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>))}
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 500 }} >
                    <InputLabel id="comment">订单状态：</InputLabel>
                    <Select
                        labelId="comment"
                        id="comment"
                        // value={commentName}
                        label="订单状态："
                        onChange={handleOrderChange}
                        name='comment'
                    >
                        {statusList.map(item => (<MenuItem key={item.comment} value={item.comment}>{item.comment}</MenuItem>))}
                    </Select>
                </FormControl>
                <Button sx={{ pl: 2 }} variant="contained" onClick={fetchData} color="primary">搜索</Button>
            </Stack>
        </Box>
        <Box sx={{ overflow: 'auto' }}>
            <DataGrid pageSize={10} rows={list} columns={columns} sx={{ height: 400 }} />
        </Box>
    </Stack >
}
export default OrderPage