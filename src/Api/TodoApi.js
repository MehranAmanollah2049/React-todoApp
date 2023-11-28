import axios from "axios";

const TodoApi = axios.create({
    baseURL: 'https://todo-laravel.iran.liara.run/api/'
});

export default TodoApi;