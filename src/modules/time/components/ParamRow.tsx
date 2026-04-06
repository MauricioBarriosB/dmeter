export default function ParamRow({ label, user, rec, why }: Readonly<{ label: string; user: string; rec: string; why: string }>) {
    return (
        <tr className="border-b border-default-100 hover:bg-default-50">
            <td className="p-3 font-medium">{label}</td>
            <td className="p-3 text-center font-mono">{user}</td>
            <td className="p-3 text-center font-mono font-semibold text-primary">{rec}</td>
            <td className="p-3 text-sm text-default-600">{why}</td>
        </tr>
    );
}
