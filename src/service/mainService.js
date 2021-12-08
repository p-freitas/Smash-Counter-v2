import axios from 'axios';
import setData from '../Main/index'


export const getBattles = () => {
    axios.get('https://61b0d4033c954f001722a69b.mockapi.io/battles')
        .then(function (response) {
            // handle success
            console.log(response.data);
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
