import React, { useContext, useState } from 'react'
import './Todo.css'
import DropDown from '../DropDown/DropDown'
import DrpOption from '../DropDown/DrpOption/DrpOption'
import TodoContext from '../../Contexts/TodoContext'
import TodoApi from '../../Api/TodoApi'
import AppContext from '../../Contexts/AppContext'
import Alert from '../../Tools/js/Alert/Alert'

export default function Todo(props) {

    let AppContextData = useContext(AppContext)

    let [todoDrp, setTodoDrp] = useState(false)
    let [Starloading, setStarState] = useState(false)

    let [isEditMode, setEditMide] = useState(false)
    let [editValue, setEditValue] = useState('')

    // drop down loadings
    let [DrpLoading,setDrpLoading] = useState(false)

    function handleDrp() {
        setTodoDrp(prev => !prev)
    }

    function setEditMode() {
        setEditMide(prev => !prev)
        setEditValue(props.title)
    }

    function chnageIntValue(e) {
        setEditValue(e.target.value)
    }

    function setDone() {

        setDrpLoading(true)

        let find = AppContextData.findTodo(props.id)
        TodoApi.post(`todo/${props.id}/${Number(find.isDone) ? 'undone' : 'done'}/change`).then(response => {
            AppContextData.TodoDispatch({type : 'changeStatus' , data: response.data})
            Alert('success',`${find.title} به حالت ${Number(find.isDone) ? 'انجام نشده' : 'انجام شده'} تغییر یافت`)
            setDrpLoading(false)
        }).catch((err) => {
            Alert('error','خطایی در سیستم رخ داد لطفا بعدا امتحان کنید')
            setDrpLoading(false)
        });
    }

    function deleteTodo() {

        setDrpLoading(true)
        TodoApi.delete(`todo/${props.id}/delete`).then(response => {
            let find = AppContextData.findTodo(props.id)
            Alert('success',`${find.title} با موفقیت حذف شد`)
            AppContextData.TodoDispatch({type : 'delete' , id: props.id})
            setDrpLoading(false)
        }).catch((err) => {
            Alert('error','خطایی در سیستم رخ داد لطفا بعدا امتحان کنید')
            setDrpLoading(false)
        });
    }

    function handleEdit(e) {
        if(e.key == 'Enter') {

            if(editValue != '') {
                let find = AppContextData.findTodo(props.id)
                if(find.title != editValue) {
                    setDrpLoading(true)
                    TodoApi.put(`todo/${props.id}/edit` , {title: editValue}).then(response => {
                        AppContextData.TodoDispatch({type : 'edit' , payload: {id: props.id,title: editValue}})
                       Alert('success',`${find.title} به ${editValue} تغییر یافت`);
                       setDrpLoading(false) 
                       setEditMide(false)
                    })
                }
                else {
                    setEditMide(false)
                }
            }
            else {

                Alert('error','فیلد ویرایش نباید خالی بماند');
            }
        }
    }

    function setPoint() {

        setStarState(true)

        TodoApi.post(`todo/${props.id}/pointed`).then(response => {
            AppContextData.TodoDispatch({type : 'changePoint' , data: response.data})
            Alert('success',`${response.data.title} ${response.data.isPointed ? 'در حالت اولویت قرار گرفت' : 'از حالت اولویت خارج شد'}`)
            setStarState(false)
        }).catch((err) => {
            Alert('error','خطایی در سیستم رخ داد لطفا بعدا امتحان کنید')
            setStarState(false)
        });
    }

    return (
        <TodoContext.Provider value={{ 
            setEditMode,
            setDone,
            deleteTodo
         }}>
            <div className={`TodoBox${isEditMode ? ' editMode' : ''}${Number(props.isDone) ? ' doneTodo' : ''}`}>
                <div className="right_todo">
                    <div className="todo_options_btn" onClick={handleDrp}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2.75 12.0001C2.75 5.06312 5.063 2.75012 12 2.75012C18.937 2.75012 21.25 5.06312 21.25 12.0001C21.25 18.9371 18.937 21.2501 12 21.2501C5.063 21.2501 2.75 18.9371 2.75 12.0001Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.9935 12H16.0025" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.9945 12H12.0035" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.9955 12H8.0045" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <DropDown side="right" isActive={todoDrp}>
                            {
                                Number(props.isDone) ? <DrpOption  title="انجام نشده" theme="yellow" type="done" /> : <DrpOption title="انجام شده" theme="green" type="done" />
                            }
                            
                            <DrpOption title={isEditMode ? 'لغو ویرایش' : 'ویرایش'} theme="blue" type="edit" />
                            <DrpOption title="حذف" theme="red" type="delete" />
                        </DropDown>
                    </div>

                    {
                        !DrpLoading && isEditMode ? <input type="text" className='editInput' value={editValue} onChange={chnageIntValue} onKeyDown={handleEdit} /> : DrpLoading ? <p className="todoText">در حال انجام عملیات...</p> : <p className="todoText">{props.title}</p>
                    }

                </div>
                <div className={`starBtn${Starloading ? ' loading' : ''}${Number(props.isPointed) ? ' pointed' : ''}`} onClick={setPoint}>
                    <div className="loading-spinner"></div>
                    <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M21.6815 9.72949C21.2945 8.08349 19.5765 7.99849 18.1955 7.92949C17.3265 7.88549 16.4275 7.84149 16.0515 7.45249C15.6685 7.05649 15.3695 6.29749 15.0785 5.56349C14.5115 4.12749 13.8685 2.50049 12.2495 2.50049C10.6315 2.50049 9.98953 4.12749 9.42153 5.56349C9.13153 6.29749 8.83153 7.05649 8.44953 7.45249C8.07253 7.84149 7.17353 7.88549 6.30453 7.92949C4.92353 7.99849 3.20553 8.08349 2.81853 9.72949C2.45153 11.2915 3.59853 12.2365 4.61053 13.0705C5.30253 13.6405 5.95653 14.1805 6.10153 14.8405C6.24253 15.4815 6.03053 16.3095 5.82553 17.1115C5.47353 18.4905 5.07353 20.0525 6.40853 21.0595C6.82553 21.3745 7.24853 21.4995 7.66653 21.4995C8.57153 21.4995 9.45353 20.9155 10.2085 20.4155C10.9075 19.9535 11.6305 19.4745 12.2495 19.4745C12.8685 19.4745 13.5925 19.9535 14.2905 20.4155C15.3955 21.1465 16.7695 22.0545 18.0925 21.0595C19.4275 20.0525 19.0275 18.4895 18.6745 17.1095C18.4695 16.3085 18.2585 15.4805 18.3985 14.8405C18.5435 14.1805 19.1975 13.6415 19.8895 13.0705C20.9015 12.2365 22.0485 11.2915 21.6815 9.72949Z" />
                    </svg>
                </div>
            </div>
        </TodoContext.Provider>
    )
}
