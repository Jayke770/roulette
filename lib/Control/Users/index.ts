import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type data = {
    Users: {
        info: {
            id: string,
            first_name?: string,
            last_name?: string,
            username: string,
            image?: string
        },
        balance: number,
        socketID: string,
        notification: {
            id: string,
            title: string,
            body: string,
            rouletteID: string,
            created: string
        }[],
        created: string,
    }[],
    UsersLoading: boolean,
    UsersError: boolean
}
export default function Users() {
    const { data, error } = useSWR('/api/control/users/all', fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
        refreshInterval: 20000
    })
    const x: data = {
        Users: data,
        UsersLoading: !error && !data,
        UsersError: error
    }
    return x
}