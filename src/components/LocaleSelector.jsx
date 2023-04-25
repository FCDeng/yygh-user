import { Fab, FormControl, MenuItem, Select } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import './LocaleSelector.css'

function LocaleSelector(props) {
	return (
    <FormControl sx={{ m: 1}} className="locale selector">
      <Select
        labelId="localeSelector"
        id="localeSelector"
        value={props.value}
        label=""
        onChange={props.onChange}
        size="small"
        sx={{background: '#fff'}}
      >
        <MenuItem value="en">
          <FormattedMessage id="english" />
        </MenuItem>

        <MenuItem value="zh">
          <FormattedMessage id="chinese" />
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default LocaleSelector
