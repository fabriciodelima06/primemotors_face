import moment from "moment";

export default ({ licenca }) => {
    const dateFormated = moment(licenca).endOf('day').format('DD MMMM YYYY')
    const diferencaDias = moment(licenca).endOf('day').diff(moment(), 'hours') / 24;

    const status = diferencaDias > 3 ? 'ATIVO' : diferencaDias < 0 ? 'VENCIDO' : 'VECENDO'

    let statusColor = 'bg-green-500'

    switch (status) {
        case 'ATIVO':
            statusColor = 'bg-green-500'
            break;
        case 'VECENDO':
            statusColor = 'bg-yellow-500'
            break;
        case 'VENCIDO':
            statusColor = 'bg-red-800'
            break;
    }

    return (
        <div className="flex flex-col items-end ">
            <h6 className={`text-sm text-white font-semibold ${statusColor} px-2 py-1 rounded-sm`}>{status}</h6>
            <h6 className="text-sm">Licenciado até: {dateFormated}</h6>
        </div>
    )
}