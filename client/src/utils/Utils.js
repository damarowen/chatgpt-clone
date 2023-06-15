import Swal from "sweetalert2";

const ShowErrorDialog = (errorMessage) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        showCancelButton: true,
        confirmButtonText: 'Refresh'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}

const GetEngines = (setModels) => {
    fetch("http://localhost:3010/models").then((res) => {
        if (!res.ok) {
            throw new Error("An error occurred while fetching the models.");
        }
        return res.json();
    }).then((data) => {
        setModels(data.data);
    }).catch((error) => {
        console.error(error);
        ShowErrorDialog(error);
    })
}


export { GetEngines, ShowErrorDialog} ;

