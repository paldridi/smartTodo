import { ScaleLoader } from "react-spinners";

const override ={
    display: 'block',
    margin: '0 auto',
    width: 'fit-content'
}

const Spinner = ({ loading }) => {
    return (
        <ScaleLoader 
            color= '#36e39e'
            loading={loading}
            cssOverride={override}
        />
    )
}

export default Spinner;