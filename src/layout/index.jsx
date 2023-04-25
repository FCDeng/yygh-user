import { Outlet } from 'react-router-dom'
// import { Fragment } from 'react'
import { Box, Container } from '@mui/material'
import Header from './Header'
import classes from './index.scss'
import GlobalSnackbar from '@/components/GlobalSSnackbar'
function Layout() {
	return (
		<>
			<Box className={classes.yyghUser}>
				<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'white', width: 1200 }}>
					<Box sx={{ flex: 'none' }}>
						<Header />
					</Box>

					<Box className={classes.main}
						sx={{
							display: 'flex', flex: 1, justifyContent: 'center', background: 'white', width: 1200,
							boxSizing: 'border-box'
						}}>
						<Outlet />
						<GlobalSnackbar />
					</Box>
				</Box>
			</Box>
		</>
	)
}

export default Layout
