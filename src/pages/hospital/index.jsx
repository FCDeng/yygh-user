import { useParams } from "react-router-dom"
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import HospitalCode from './HospitalCode'
import HospitalDetail from './HospitalDetail'
import Schedule from './Schedule'
import Registration from './Registration'
import { useState, useEffect } from "react";
import classes from './index.scss'
import { useSelector, useDispatch } from 'react-redux'
import { SET_PatientStateValue, SET_PatientStateIndex, SET_UserStateValue, SET_UserStateIndex } from '@/store/user'
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
                <Box sx={{ p: 2, display: 'flex', flex: 1, width: 1000 }}>
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

const HospitalPage = () => {
    const { hoscode } = useParams()
    const [value, setValue] = useState(0);
    const [depCode, setDepCode] = useState(null);
    const [scheduleId, setScheduleId] = useState('');
    const [hospital, setHospital] = useState({
        param: {}
    })
    const user = useSelector((state) => {
        return state.user
    })
    const dispatch = useDispatch();

    const [bookingRule, setBookingRule] = useState({})
    const [departmentVoList, setDepartmentVoList] = useState([])

    const [showHospIndex, setShowHospIndex] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => { 
        // if (user.userStateIndex) {
        //     setShowHospIndex(user.userStateIndex)
        //     dispatch(SET_UserStateIndex({ userStateIndex: 0 }))
        // }
    }, []);

    return <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', flex: 1, width: '100%' }}
    >
        <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider', width: 200 }}
        >
            <Tab label="预约挂号" {...a11yProps(0)} />
            <Tab label="医院详情" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0} >
            {showHospIndex === 0 ? <HospitalCode hoscode={hoscode} setShowHospIndex={setShowHospIndex} setDepCode={setDepCode} /> : null}
            {showHospIndex === 1 ? <Schedule depcode={depCode} hoscode={hoscode} setShowHospIndex={setShowHospIndex} setScheduleId={setScheduleId} /> : null}
            {showHospIndex === 2 ? <Registration depcode={depCode} hoscode={hoscode} scheduleId={scheduleId} setShowHospIndex={setShowHospIndex} /> : null}
        </TabPanel>
        <TabPanel value={value} index={1}  >
            <HospitalDetail hoscode={hoscode} />
        </TabPanel>


    </Box>
}

export default HospitalPage