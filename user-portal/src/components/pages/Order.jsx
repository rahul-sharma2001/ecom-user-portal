import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../atoms/Navbar";
import FilterDropdown from "../atoms/FilterDropdown.jsx";
import { useEffect, useState } from "react";
import EmptyOrders from "../organisms/EmptyOrders";
import OrderList from "../organisms/OrderList";
import Search from "../molecules/SearchBar";
import { FetchOrders, SearchOrders } from "../../services/Order";
import moment from "moment";
import Pagination from "../molecules/Pagination";
import { LIMIT, OFFSET, SEARCH_URL } from "../../constants/constants";

function Order() {
  const ORDER_URL = "http://localhost:4000/api/order";
  let [orderList, setOrderList] = useState([]);
  let [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (filter === "Last 30 Days") {
      setFilter("Last30");
      return;
    }
    if (filter === "Filter Orders") {
      setFilter(undefined);
      return;
    }
    fetchdata(ORDER_URL, "u1", LIMIT, OFFSET);
  }, [filter]);
  useEffect(() => {
    SearchOrderData(SEARCH_URL, "u1", LIMIT, OFFSET);
  }, [search]);

  let fetchdata = async (url, userId, limit, offset) => {
    let response = await FetchOrders(url + `/${userId}`, {
      params: { limit: limit, offset: offset, filter: filter },
    });
    setOrderList(response.data.details);
    return response.data.details;
  };
  async function SearchOrderData(url, userId, limit, offset) {
    let tempresp = await SearchOrders(url, userId, limit, offset, search);
    setOrderList(tempresp.data.details);
  }
  async function handlePage(event) {
    const newOffSet = event.selected * LIMIT;
    let tempresp = await fetchdata(ORDER_URL, "u1", LIMIT, newOffSet);
    setOrderList(tempresp.data.details);
  }

  return (
    <main>
      <div className="container">
        <div className="order-main-container">
          <div className="row d-flex flex-row justify-content-left align-items-center">
            <div className="col-sm-5 pt-3">
              <div className="order-navbar">
                <Navbar link1="Home" link2="My Account" link3="My Orders" />
              </div>
            </div>
            <div className="col-sm-7">
              <div className="filters-dropdown" style={{ float: "right" }}>
                <FilterDropdown
                  changeFilter={(filter) => {
                    setFilter(filter);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="order-searchbar w-100">
              <Search
                changeSearch={(value) => {
                  setSearch(value);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              {orderList.length !== 0 ? (
                orderList.map((item) => {
                  return (
                    <OrderList
                      key={item._Id}
                      _Id={item._Id}
                      name={item.products[0].name}
                      price={item.products[0].price}
                      orderDate={moment(item.orderDate).format("DD MMM YYYY")}
                      deliveryDate={moment(item.deliveryDate).format(
                        "DD MMM YYYY"
                      )}
                      status={item.status}
                      imageurl={item.products[0].images[0]}
                      order={item}
                    />
                  );
                })
              ) : (
                <>
                  {" "}
                  <EmptyOrders />
                </>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              {
                <Pagination
                  totalCount={30}
                  currentPage={0}
                  handlePageClick={(e) => handlePage(e)}
                />
              }
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Order;