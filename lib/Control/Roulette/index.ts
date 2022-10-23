import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type data = {
    roulettes: {
        id: string,
        autoStart: boolean,
        name: string,
        prize: string,
        StartDate: string,
        maxParticipants: number,
        isDone: boolean,
        participants: {
            id: string,
            userid: string,
            created: string
        }[],
        created: string
    }[],
    roulettesLoading: boolean,
    roulettesError: boolean
}
export default function Roulettes() {
    const { data, error } = useSWR('/api/control/roulette/all', fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
        refreshInterval: 20000
    })
    const x: data = {
        roulettes: data,
        roulettesLoading: !error && !data,
        roulettesError: error
    }
    return x
}