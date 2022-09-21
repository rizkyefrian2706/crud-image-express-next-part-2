import Image from 'next/image';
import Link from 'next/link'
import { useEffect, useState } from "react";
import User from "./api/user";

export default function index() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dataUser, setDataUser] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showAlert, setShowAlert] = useState("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    async function getFetch() {
      const user = await User.getAllData()
      setDataUser(user)
    }
    getFetch()
  }, []);

  const loppPost = (dataUser) => {
    return dataUser.map((item) => {  
      return (
        <div key={item.id}>
          <div className="bg-gray-100 shadow-md px-4 py-2 rounded-md">
            <div>
              <h1 className="text-xl font-medium">{item.username}</h1>
            </div>
            <Image src={item.img} alt="gambar" height="100" width="100" />
            <div className="my-2">
              <Link href={`/${encodeURIComponent(item.id)}`}>
                <button className="px-2 py-1 bg-blue-800 rounded-sm text-white outline-none focus:ring-4 shadow-lg text-sm mr-1">
                  Edit
                </button>
              </Link>
              <button onClick={(e) => deletePost(item.id)} className="px-2 py-1 bg-red-800 rounded-sm text-white outline-none focus:ring-4 shadow-lg text-sm mr-1">Hapus</button>
            </div>
          </div>
          <br />
        </div>
      )
    })
  }

  const deletePost = async (id) => {
    const res = await User.deleteData(id) 
    if (res == "success") {
      const user = await User.getAllData()
      setDataUser(user)
      funcShowAlert("Deleted Success");
    }
  }

  //alert
  async function funcShowAlert(msg, url = "") { 
    setShowAlert(msg);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        setShowAlert("")
        resolve(true)
        if (url != "") {
          router.push(url)
        }
      }, 3000);
    })
  }

  return (
    <div>
      <div className="container mx-auto px-4 max-w-screen-sm">

        {showAlert != "" ? (
          <div
            className={
              "text-white px-6 py-4 border-0 rounded relative mb-4 bg-blue-500"
            }
          >
            <span className="text-xl inline-block mr-5 align-middle">
              <i className="fas fa-bell" />
            </span>
            <span className="inline-block align-middle mr-8">
              {showAlert}
            </span>
            <button
              className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
              onClick={() => setShowAlert("")}
            >
              <span>×</span>
            </button>
          </div>
        ) : null}

        <div>
          <Link href="/create">
            <a className="bg-red-600 text-center text-white px-4  py-2 my-4 inline-block">
              Tambah User
            </a>
          </Link>
        </div>
        <div>
          {loppPost(dataUser)}
        </div>
      </div>
    </div>
  )
}