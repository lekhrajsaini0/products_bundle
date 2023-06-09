import React, { useState } from "react";
import AddModal from "../AddModal";
import "./ProductList.css";
import { FiEdit2 } from "react-icons/fi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Dragger from "../../images/dragger.png";
import cancel from "../../images/cancel.png";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const ProductList = () => {
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const [arr, setArr] = useState([{ add_id: uuid(), variants: [] ,discount:0}]);
  const [variant, setVariant] = useState([]);
  const [clicked, setClicked] = useState(arr[0]);
  const [open, setOpen] = useState(false);

  const handleAddProduct = () => {
    setArr([...arr, { add_id: uuid(), variants: [] }]);
  };

  const handleRemove = (ele) => {
    let newarr = arr.filter((item) => item.add_id !== ele.add_id);
    setArr(newarr);

    let newVariant = variant.filter(
      (item) => item.product_id !== ele?.product_fetch?.id
    );
    setVariant(newVariant);
  };

  const handleClick = (ele) => {
    setClicked(ele);
    setOpen(true);
  };

  return (
    <div className="main">
      <div className="heading_text">
        <div>Add Product</div>
       
      </div>
      <div className="subHeading">
        <h2 className="discount_product">Products</h2>
        <h2 className="discount_text">Discounts</h2>
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          console.log(result);
          if (!result.destination) {
            return;
          }

          if (result.destination.index === result.source.index) {
            return;
          }

          const temp = reorder(
            arr,
            result.source.index,
            result.destination.index
          );

          setArr(temp);
        }}
      >
        <Droppable droppableId="List">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="productItemContainer"
            >
              {arr.map((ele, idx) => (
                <Draggable
                  key={ele.add_id}
                  draggableId={ele.add_id.toString()}
                  index={idx}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="product_item_container"
                    >
                      <div className="product_item">
                        <img src={Dragger} className="img_util" alt="dragg" />
                        <div className="productCount">{idx + 1}.</div>
                        <div className="first_section">
                          <h1>
                            {(ele?.title &&
                              ele?.title.slice(0, 18) + ". . .") ||
                              "select product"}
                          </h1>

                          <FiEdit2
                            color="rgba(0, 0, 0, 0.2)"
                            onClick={() => handleClick(ele)}
                          />
                        </div>
                        <div className="second_section">
                          <div
                            className="discount"
                            onClick={(e) => {

                             

                              document
                                .getElementsByClassName("discount")[0]
                                .classList.replace(
                                  "discount",
                                  "discount_hidden"
                                );
                              document.getElementById(
                                "discount" + ele.add_id
                              ).style.display = "flex";
                            }}
                          >
                            add discounts
                          </div>
                          <div
                            id={"discount" + ele.add_id}
                            className="addDiscount"
                          >
                            <input
                              type="text"
                              className="input_discount"
                              id={"input_discount"+ele.add_id}
                              onChange={(e)=>{

                               let a = e.currentTarget.value;
                               console.log(a);
                               let arrTemp =arr.map((el)=>{
                                  if(el.add_id===ele.add_id)
                                  {
                                    return {...el,discount:a}
                                  }
                                  return el

                               })
                                setArr(arrTemp)

                              }}
                            ></input>
                            <select className="discount_select" onChange={(e)=>{
                                let b =e.currentTarget.value
                                console.log(b);
                                let arrTemp =arr.map((el)=>{
                                  if(el.add_id===ele.add_id)
                                  {
                                    return {...el,type:parseInt(b)}
                                  }
                                  return el

                               })
                                setArr(arrTemp)



                            }}>
                              <option value="1">Flat Off</option>
                              <option value="2">% off</option>
                            </select>
                          </div>
                          <img
                            src={cancel}
                            className="img_util"
                            alt="canecel"
                            onClick={() => handleRemove(ele)}
                          />
                        </div>
                      </div>

                      <div className="third_section">
                        {ele.variants.length > 0 && (
                         <div className="list_variant_container ">
                           
                            <button className="invisible"
                            id={"btn-hide-"+ele.add_id}
                              onClick={(e) => {
                                e.currentTarget.classList.add("invisible")
                                document.getElementById("btn-show-"+ele.add_id).classList.remove("invisible")
                                document
                                  .getElementById("subItem-" + ele.add_id)
                                  .classList.toggle("invisible");
                              }}
                            >
                         <div className="inner_btn">    show variants <MdKeyboardArrowDown size={30} /></div>
                            </button>
                        
                         
                            <button
                             id={"btn-show-"+ele.add_id}
                              onClick={(e) => {



                                e.currentTarget.classList.add("invisible")
                                document.getElementById("btn-hide-"+ele.add_id).classList.remove("invisible")
                                document
                                  .getElementById("subItem-" + ele.add_id)
                                  .classList.toggle("invisible");
                              }}
                            >
                             <div className="inner_btn"> hide variants <MdKeyboardArrowUp size={30} /></div>
                            </button>
                         
                         </div>
                        )}
                        <DragDropContext
                          onDragEnd={(result) => {
                            console.log(result);
                            if (!result.destination) {
                              return;
                            }

                            if (
                              result.destination.index === result.source.index
                            ) {
                              return;
                            }

                            let temp = reorder(
                              ele.variants,
                              result.source.index,
                              result.destination.index
                            );

                            const temparr = arr.map((item) => {
                              if (item.add_id === ele.add_id) {
                                return { ...item, variants: temp };
                              }
                              return item;
                            });
                            setArr(temparr);
                          }}
                        >
                          <Droppable droppableId="variant">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                id={"subItem-" + ele.add_id}
                                style={{width:"100%",marginTop:20}}
                              >
                                {ele.variants.length > 0 &&
                                  ele?.variants.map((elem, index) => {
                                    return (
                                      <Draggable
                                        draggableId={elem.id.toString()}
                                        index={index}
                                        key={elem.id}
                                      >
                                        {(provided) => (
                                          <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            className="subItem_container"
                                          >
                                            <img
                                              src={Dragger}
                                              className="img_util_sub"
                                              alt="dragger"
                                            />
                                            <div className="subItem">
                                            <div  className="subItem_hero">
                                              <h2>{elem.title}</h2>
                                            </div>
                                            <div  className="subItem_product">
                                             {
                                          ele?.discount ||0
                                             }
                                            </div>
                                            <div  className="subItem_type">
                                             {
                                              ele?.type ===1 ?`Flat Off`:`% Off`
                                             }
                                            </div>
                                            </div>
                                            <img
                                              src={cancel}
                                              className="img_util_cancel"
                                              alt="cancel"
                                              onClick={() => {
                                                let temp = ele.variants.filter(
                                                  (item) => item.id !== elem.id
                                                );

                                                let temparr =
                                                  ele.variants.filter(
                                                    (item) =>
                                                      item.id !== elem.id
                                                  ).length;

                                                if (temparr === 0) {
                                                  let temp2 = arr.filter(
                                                    (item) =>
                                                      item.add_id !== ele.add_id
                                                  );

                                                      


                                                  setArr(temp2);
                                                } else {
                                                  let temp3 = arr.map(
                                                    (item) => {
                                                      if (
                                                        ele.add_id ===
                                                        item.add_id
                                                      ) {
                                                        return {
                                                          ...item,
                                                          variants: temp,
                                                        };
                                                      }
                                                      return item;
                                                    }
                                                  );
                                                  setArr(temp3);
                                                }
                                              }}
                                            />
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                                  <hr  className="endLine"/>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="add_product_container">
          <button onClick={handleAddProduct} className="add_product">
            add product
          </button>
        </div>
        <AddModal
          open={open}
          setOpen={setOpen}
          product={clicked}
          setArr={setArr}
          arr={arr}
          clicked={clicked}
          variant={variant}
          setVariant={setVariant}
        />
      </DragDropContext>
    </div>
  );
};

export default ProductList;
