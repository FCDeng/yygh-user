import { useParams, useSearchParams } from "react-router-dom"
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import UserListPage from './UserListPage'
import UserPage from '../user'
import UserShow from './UserShow'
import OrderPage from '../order'
import UserAdd from './UserAdd'
import OrderShow from '../order/OrderShow'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { SET_PatientStateValue, SET_PatientStateIndex, SET_UserStateValue, SET_UserStateIndex } from '@/store/user'
import LoginDialog from '@/components/LoginDialog';
import userInfoApi from '@/api/user/userInfo'
import classes from './index.scss'
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 1, display: 'flex', flex: 1, flexDirection: 'column' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const PatientPage = () => {
    const [search, setSearch] = useSearchParams()
    const user = useSelector((state) => {
        return state.user
    })
    const dispatch = useDispatch();

    const { id, patientIndex, userIndexDefault } = useParams()
    const [value, setValue] = useState(0);
    const [hoscode, setHoscode] = useState(null)
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [hospital, setHospital] = useState({
        param: {}
    })
    const [orderId, setOrderId] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [showDetail, setShowDetail] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showUserList, setShowUserList] = useState(true)
    const [showUserIndex, setShowUserIndex] = useState(0)
    const [showOrderIndex, setShowOrderIndex] = useState(0)
    const paramOrderIndex = search.get('paramOrderIndex')
    const paramOrderId = search.get('orderId')
    const paramValueIndex = search.get('paramValueIndex')
    // const paramOrderIndex = search.get('paramOrderIndex')
    const [authStatus, setAuthStatus] = useState(2);
    useEffect(() => {
        getUserInfo()
        if (paramOrderIndex) {
            setShowOrderIndex(paramOrderIndex*1 || 0)
            setValue(paramOrderIndex*1)
        }

        if (paramValueIndex) {
            if (paramValueIndex != 0 && authStatus != 2) {
                setValue(0)
            } else {
                setValue(paramValueIndex * 1)
            }
        }
        // if (paramOrderId) {
        //     setOrderId(paramOrderId)
        // }

        if (patientIndex) {
            setValue(patientIndex)
        } else if (user.patientStateValue) {
            setValue(user.patientStateValue)
            dispatch(SET_PatientStateValue({ patientStateValue: 0 }))
        }
        if (userIndexDefault) {
            setShowUserIndex(userIndexDefault)
        } else if (user.patientStateValue) {
            setShowUserIndex(user.patientStateValue)
            // dispatch(SET_PatientStateValue({ patientStateIndex: 0 }))
        }
    }, [paramValueIndex, paramOrderIndex]);

    const getUserInfo = () => {
        userInfoApi.getUserInfo().then(response => {
            setAuthStatus(response.data.authStatus)
        })
    }

    const handleChange = (event, newValue) => {
        if (value == 0 && authStatus != 2) return
        setValue(newValue);
        setShowUserIndex(0)
        setShowOrderIndex(0)
        setSearch({})
    };
    return <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', flex: 1 }}
    >
        <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider', width: 150 }}
        >
            <Tab label="实名认证" {...a11yProps(0)} />
            <Tab label="挂号订单" {...a11yProps(1)} />
            <Tab label="患者管理" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0} >
            <UserPage />
        </TabPanel>
        <TabPanel value={value} index={1}  >
            {showOrderIndex == 0 ? <OrderPage /> : null}
            {showOrderIndex == 1 ? <OrderShow orderId={search.get('orderId')} /> : null}
        </TabPanel>
        <TabPanel value={value} index={2}>
            {showUserIndex === 0 ? <UserListPage setPatientId={setPatientId} id={id} setShowUserIndex={setShowUserIndex} /> : null}
            {showUserIndex === 1 ? <UserShow id={id} patientId={patientId} setShowUserIndex={setShowUserIndex} /> : null}
            {showUserIndex === 2 ? <UserAdd id={id} patientId={patientId} setPatientIndex={setValue} setShowUserIndex={setShowUserIndex} /> : null}
        </TabPanel>
        <LoginDialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)} />
    </Box>
}

export default PatientPage