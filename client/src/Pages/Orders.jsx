import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import DynamicBg from '../components/DynamicBg';
import Footer from '../components/Footer'
import { assets } from '../assets/assets';

const Orders = () => {

  const { backendUrl, token } = useContext(AppContext);
  const [orderData, setOrderData] = useState([]);



  const fetchOrderData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/order/getOrders", { headers: { token } });
      if (response.data.success) {
        setOrderData(response.data.data);
      }
    } catch (error) {
      console.log("error in fetchorderData", error.message);
    }
  }

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  useEffect(() => {
    fetchOrderData();
  }, [token])

  return (
    <div>
      <DynamicBg title={"Orders"} />
      <div className='min-h-[50vh] flex flex-col justify-center items-center py-32'>

        {
          orderData.length === 0 ? <div className='text-4xl text-[#492d13] text-center font-Outfit font-semibold' >No 
          orders yet 😥</div> :
            <>

              <div className=' mx-2 md:mx-10 lg:mx-28 space-y-10'>
                {
                  orderData.map((order, idx) => (
                    <div key={idx} className='border-[3px] border-[#fff5ed] p-4 gap-1 xl:gap-10 grid  grid-cols-4 lg:grid-cols-7 justify-center items-center space-x-4 xl:space-x-8 ' >
                      <img src={assets.parcelicon} alt="" className='flex w-10  md:w-24 ' />
                      <div className='  col-span-3 lg:col-span-2 font-Outfit font-normal text-[12px]  md:text-[16px]  ' >
                        {
                          order.items.map((item, i) => {
                            if (i === order.items.length - 1) {
                              return item.name + " x " + item.quantity
                            } else {

                              return " " + item.name + " x " + item.quantity + ", "
                            }
                          })
                        }
                      </div>
                      <p className='font-Outfit font-medium text-[12px] md:text-[16px] text-center p-1' >${order.amount.toFixed(2)}</p>
                      <p className='font-Outfit font-medium text-[12px] md:text-[16px] text-center p-1' >Items: {order.items.length}</p>
                      <p className='font-Outfit font-medium text-[12px] md:text-[16px] text-center  ' > <span className='text-[tomato] text-sm' >&#x25cf;</span> <span  className='text-xs md:text-[16px] font-Outfit font-medium' >{order.status}</span> </p>
                      <button className='border py-2 rounded-lg bg-[#f29c52] text-white font-Outfit font-normal md:font-medium
                    hover:bg-[#492d13] transition-all duration-200 text-[12px] ' >Track Order</button>
                    </div>
                  ))
                }
              </div>
            </>
        }


      </div>
      <Footer />
    </div>
  )
}

export default Orders