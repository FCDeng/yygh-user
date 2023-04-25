import service from '@/service'

export function login(data) {
	return service({
		url: '/login',
		method: 'post',
		data,
	})
}

export function getUser(id) {
	return service({
		url: `/user/${id}`,
		method: 'get',
	})
}
