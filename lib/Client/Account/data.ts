import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type User = {
    info: {
        id?: string,
        first_name?: string,
        last_name?: string,
        username: string,
        image?: string
    }
}
interface Account {
    account: User | null,
    accountLoading: boolean,
    accountError: boolean
}
export default function AccountData(id: any) {
    const { data, error } = useSWR(`/api/client/${id}`, fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
        refreshInterval: 20000
    })
    const x: Account = {
        account: data,
        accountLoading: !error && !data,
        accountError: error
    }
    return x
}