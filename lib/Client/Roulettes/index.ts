import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type Roulette = {
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
    }[],
    roulettesLoading: boolean,
    roulettesError: boolean
}
export default function Roulettes(id: any) {
    const { data, error } = useSWR(`/api/roulette/${id}`, fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
        refreshInterval: 20000
    })
    const x: Roulette = {
        roulettes: data,
        roulettesLoading: !error && !data,
        roulettesError: error
    }
    return x
}