import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import React from "react"
import { wrapper } from "../redux/store"

const MyApp = ({ Component, pageProps }) => (
  <div className="flex flex-col h-screen justify-between">
    <Component {...pageProps} />
  </div>
)

export default wrapper.withRedux(MyApp);