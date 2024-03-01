import { ReactNode, useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import fetchingImg from "./assets/data-fetching.png"
import ErrorMessage from "./components/ErrorMessage";

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string
}

function App() {
  const [fetchedPosts, setFetchedPoats] = useState<BlogPost[] | undefined>()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function  fetchPosts () {
      setIsFetching(true)

      try {
        const data = await get('https://jsonplaceholder.typicode.com/posts') as RawDataBlogPost[]
        const blogPosts: BlogPost[] = data.map(blog => {
          return {
            id: blog.id,
            title: blog.title,
            text: blog.body
          }
        })
        setFetchedPoats(blogPosts)
      } catch(e) {
        if(e instanceof Error) setError(e.message)
      }
      setIsFetching(false)
    }
    fetchPosts()
  }, [])

  let content: ReactNode

  if(fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts}></BlogPosts>
  }

  if(isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>
  }
  if(error) {
    content = <ErrorMessage text={error}></ErrorMessage>
  }
  return (<main>
    <img src={fetchingImg} alt ="An image"></img>
    {content}
  </main>);
}

export default App;
