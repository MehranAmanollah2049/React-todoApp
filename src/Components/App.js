import React, { Fragment, useEffect, useReducer, useState } from 'react'
import Alert from './../Tools/js/Alert/Alert'
import './App.css'
import DropDown from './DropDown/DropDown'
import DrpOption from './DropDown/DrpOption/DrpOption'

// context
import AppContext from './../Contexts/AppContext'
import Todo from './Todos/Todo'

// reducer
import TodoReducer from '../Reducers/TodoReducer'

// api
import TodoApi from './../Api/TodoApi';


export default function App() {


  let [todoDatas, TodoDispatch] = useReducer(TodoReducer, [])
  let [FilteredData, setFilteredData] = useState([])

 

  useEffect(() => {

    setTodosLoading(true)
    TodoApi.get('getList').then(response => {
      TodoDispatch({ type: 'initData', data: response.data })
      setTodosLoading(false)
    })

  }, [])

  // loadings
  let [isSubmitLoading, setSubmitLoading] = useState(false)
  let [todosLoading, setTodosLoading] = useState(false)
  let [DeletAllLoading, setDeletAllLoading] = useState(false)


  let [todoInputVal, setTodoVal] = useState('')

  let [FilterTodos, setTodosFilter] = useState('')

  useEffect(() => {
    getFilterTodos()
  },[todoDatas,FilterTodos])


  function setTodoValFun(e) {
    setTodoVal(e.target.value)
  }

  function handleSubmit(e) {

    e.preventDefault()

    if (todoInputVal) {

      setSubmitLoading(true)
      TodoApi.post('addTodo', { title: todoInputVal }).then(response => {
        let { data } = response;

        TodoDispatch({ type: 'addTodo', data })
        Alert('success', `${todoInputVal}  با موفقیت ثبت شد`, 6000)

        resetForm()

      }).catch((err) => {
        if (err.response.status == 302) {
          if (err.response.data == 'added before') {
            Alert('error', 'این تودو از قبل ثبت شده', 6000)
          }
        }
        else {
          Alert('error', 'خطایی در سیستم رخ داد , لطفا بعدا امتحان کنید', 6000)
        }
        resetForm()
      })


    }
    else {
      Alert('error', 'لطفا اطلاعات خواسته شده را وارد کنید')
    }
  }

  function resetForm() {
    setSubmitLoading(false)
    setTodoVal('')
    setAddTodoPopUp(false)

  }



  /////////////////////////// drop downs

  let [FilterDrp, setFilterDrp] = useState(false)

  function handleFilterDrp() {
    setFilterDrp(prev => !prev)
  }


  let [AddTodoPopUp, setAddTodoPopUp] = useState(false)

  function openAddTodoPopUp() {
    setAddTodoPopUp(true)
  }
  function closeAddTodoPopUp() {
    setAddTodoPopUp(false)
  }

  /////////////////////////// drop downs


  function getFilterTodos() {

    if (todoDatas != []) {
      if (FilterTodos == 'همه' || FilterTodos == '') {
        let list = [...todoDatas]
        setFilteredData(list.sort((a,b) => (Number(a.isPointed) === Number(b.isPointed))? 0 : Number(a.isPointed)? -1 : 1))
      }
      else if (FilterTodos == 'انجام شده') {
        setFilteredData(todoDatas.filter(item => item.isDone == true));
      }
      else if (FilterTodos == 'انجام نشده') {
        setFilteredData(todoDatas.filter(item => item.isDone != true));
      }
      else if (FilterTodos == 'اولویت ها') {
        setFilteredData(todoDatas.filter(item => item.isPointed == true));
      }
    }
    else {
      setFilteredData([]);
    }

  }

  function setFilter(value) {
    setTodosFilter(value)
  }

  function findTodo(id) {
    return todoDatas.find(todo => todo.id == id)
  }

  function deleteAll() {

    setDeletAllLoading(true)

    TodoApi.delete('deleteAll').then(response => {

      TodoDispatch({ type: 'initData' , data: [] })
      Alert('success','همه تودو ها با موفقیت حذف شدند')
      setDeletAllLoading(false)
      setTodosFilter('')
    })
  }

  return (
    <AppContext.Provider value={{
      setFilter,
      TodoDispatch,
      findTodo
    }}>
      <div className="Notification"></div>
      <div className="containerAll">
        <div className="topMenu">
          <div className="logo">تودو لیست</div>
          <div className="drpBtn" onClick={handleFilterDrp}>
            <span>فیلتر</span>
            <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g fillRule="nonzero">
                  <path d="M7.28010296,13.8241391 L12.1346718,13.8389907 C12.4373745,13.8400513 12.6824196,14.0935341 12.6824196,14.4042891 L12.6824196,14.4042891 L12.6824196,17.1353269 C12.6824196,17.4471425 12.5053282,17.7292613 12.2293951,17.8597148 L12.2293951,17.8597148 L7.8227027,19.92894 C7.7197426,19.9766669 7.61060489,20 7.50146718,20 C7.35629344,20 7.21111969,19.9575761 7.08447876,19.8737889 C6.86311454,19.7274265 6.72926641,19.4750044 6.72926641,19.2045521 L6.72926641,19.2045521 L6.72926641,14.3894407 C6.72926641,14.0765645 6.97637066,13.8230818 7.28010296,13.8241391 L7.28010296,13.8241391 Z M17.8718147,3.55271368e-15 C19.047619,3.55271368e-15 20,0.981052431 20,2.19225446 L20,2.19225446 L20,3.72375685 C20,4.31132771 19.770399,4.87556543 19.362677,5.28707715 L19.362677,5.28707715 L12.8576577,11.8670223 C12.7454311,11.9815668 12.5930502,12.0452027 12.4355212,12.0441551 L12.4355212,12.0441551 L6.98893179,12.0271725 C6.82316602,12.0271725 6.66563707,11.9561125 6.55238095,11.8320226 L6.55238095,11.8320226 L0.574517375,5.25738043 C0.204890605,4.85117169 -2.13162821e-14,4.3145095 -2.13162821e-14,3.75769596 L-2.13162821e-14,3.75769596 L-2.13162821e-14,2.19331506 C-2.13162821e-14,0.982113028 0.952380952,3.55271368e-15 2.12818533,3.55271368e-15 L2.12818533,3.55271368e-15 Z"></path>
                </g>
              </g>
            </svg>
            <DropDown side="left" isActive={FilterDrp}>
              <DrpOption title="همه" type="filterDrp" />
              <DrpOption title="انجام شده" type="filterDrp" />
              <DrpOption title="انجام نشده" type="filterDrp" />
              <DrpOption title="اولویت ها" type="filterDrp" />
            </DropDown>
          </div>
        </div>
        <div className="bottomMenu">
          {
            todosLoading && <div className="loadingAll">
              <div className="loading-spinner"></div>
            </div>
          }
          {
            !todosLoading && FilteredData.length == 0 && FilterTodos.length == 0 ? <p className='emptyTodo'>هیچی وجود نداره</p> : !todosLoading && FilteredData.length == 0 && FilterTodos.length != 0 ?  <p className='emptyTodo'>موردی یافت نشد</p> : ''
          }
          {
            !todosLoading && FilteredData.length != 0 && FilteredData.map(todo => {
              return <Todo key={todo.id} {...todo} />
            })
          }

        </div>
        <div className={`todoAllBtns${todoDatas.length == 0 ? ' leftside' : ''}`}>
          {
            todoDatas.length != 0 && <div className={`deleteAll${DeletAllLoading ? ' loading' : ''}`} onClick={deleteAll}>
            <div className="loading-spinner"></div>
            <span>حذف همه تودو ها</span>
          </div>
          }
          
          <div className="addBtn" onClick={openAddTodoPopUp}>افزودن تودو جدید</div>
        </div>
      </div>
      <div className={`AddTodoContainer${AddTodoPopUp ? ' active' : ''}`}>
        <div className="overlayAddTodo" onClick={closeAddTodoPopUp}></div>
        <form className="containerForm" onSubmit={handleSubmit}>
          <div className="topForm">
            <p className="title_popup">فرم ثبت تودو</p>
            <div className="closeBtn" onClick={closeAddTodoPopUp}>
              <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                  <g id="Close-Square" transform="translate(2.000000, 2.000000)" strokeWidth="1.5">
                    <line x1="12.3955" y1="7.5949" x2="7.6035" y2="12.3869" id="Stroke-1"></line>
                    <line x1="12.397" y1="12.3898" x2="7.601" y2="7.5928" id="Stroke-2"></line>
                    <path d="M14.3345,0.7502 L5.6655,0.7502 C2.6445,0.7502 0.7505,2.8892 0.7505,5.9162 L0.7505,14.0842 C0.7505,17.1112 2.6355,19.2502 5.6655,19.2502 L14.3335,19.2502 C17.3645,19.2502 19.2505,17.1112 19.2505,14.0842 L19.2505,5.9162 C19.2505,2.8892 17.3645,0.7502 14.3345,0.7502 Z" id="Stroke-3"></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <textarea className='textBox' placeholder='تودوی خود را اینجا بنویسید...' value={todoInputVal} onChange={setTodoValFun}></textarea>
          <button type='submit' className={`addTodoBtn${isSubmitLoading ? ' loading' : ''}`}>
            <div className="loading-spinner"></div>
            <span>ثبت اطلاعات</span>
          </button>
        </form>
      </div>
    </AppContext.Provider>
  )
}
