import moment from 'moment'

const dateLong = (val) => {
  if (val) return moment(val).local().format('DD MMM YYYY, h:mm:ss A')
  return ''
}

const dateShort = (val) => {
  if (val) return moment(val).local().format('DD MMM YYYY')
  return ''
}

const fromNow = (val) => {
  if (val) return moment(val).local().fromNow()
  return ''
}

const dateTheme = (val) => {
  if (val) return moment(val).local().format('mm/DD/yy')
  return ''
}

const convertDate = (val) => {
  if (val) return moment(val, 'YYYY-MM-DD').local().toDate()
  return ''
}

const dateTimeDiff = (val1) => {
  // moment.locale('my');
  const dateofvisit = moment(val1)
  const today = moment()

  if (today.diff(dateofvisit, 'minutes') < 60) {
    return today.diff(dateofvisit, 'minutes') + ' min ago'
  }

  if (today.diff(dateofvisit, 'h') < 24) {
    return today.diff(dateofvisit, 'h') + ' hrs ago'
  }

  if (today.diff(dateofvisit, 'days') >= 1) {
    return moment.utc(dateofvisit).local().format('DD MMM YYYY')
  }
}

const utcToLocal = (val) => {
  if (val) return moment(val).local()
  return moment(val).local()
}

const utcToLocalTime = (val) => {
  if (val) return moment(val, 'h:mm A').local().format('h:mm A')
  return ''
}

const setTime = (val) => {
  if (val) return new Date('Mon, 01 Jan 2021 ' + val)
  return ''
}

const formattedTime = (val) => {
  if (val) return moment(val, 'HH:mm:ss').local().format('hh:mm A')
  return ''
}

const formattedTimestamp = (val) => {
  if (val) {
    const datetime = moment(val.toDate()).local().format('DD MMM YYYY, h:mm:ss A')
    return moment(new Date(datetime)).fromNow()
  }
  return ''
}

const timestampToHour = (val) => {
  if (val) {
    return moment(val.toDate()).local().format('h:mm A')
  }
  return ''
}

const formatCalendar = (val) => {
  if (val) {
    return moment(new Date(val)).local().calendar()
  }
  return ''
}

const formatChatListTime = (val) => {
  if (val) {
    const formatDate = moment(val.toDate()).local().calendar()
    if (formatDate === 'Today') {
      return moment(val.toDate()).local().format('h:mm A')
    }
    return formatDate
  }
  return ''
}

const dateformat = (val) => {
  return val.format('YYYY-MM-DD')
}

export { dateLong, dateShort, fromNow, dateTheme, dateTimeDiff, convertDate, utcToLocal, utcToLocalTime, setTime, formattedTime, formattedTimestamp, timestampToHour, formatCalendar, formatChatListTime, dateformat }
