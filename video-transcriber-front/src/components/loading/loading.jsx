import './loading.css'

export default function Loading()
{
    return (
        <div className="loading-main"
            style={{fontSize: "unset"} }>
            <h2>{`Загрузка информации`}
                <div className="honeycomb">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </h2>
        </div>
    )
}