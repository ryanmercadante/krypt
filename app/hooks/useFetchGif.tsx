import { useEffect, useState } from 'react'

const API_KEY = process.env.GIPHY_API

const useFetchGif = ({ keyword }: { keyword: string }) => {
  const [gifUrl, setGifUrl] = useState('')

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword
          .split(' ')
          .join('')}&limit=1`
      )
      const { data } = await response.json()

      setGifUrl(data[0]?.images?.downsized_medium?.url)
    } catch (err) {
      setGifUrl(
        'https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif'
      )
    }
  }

  useEffect(() => {
    if (keyword) {
      fetchGifs()
    }
  }, [keyword])

  return gifUrl
}

export default useFetchGif