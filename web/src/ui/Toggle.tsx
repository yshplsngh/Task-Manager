import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLInputElement> {
  text?: string;
}

const Toggle = ({...props }: Props) => {
    return (
        <div className="inline-flex items-center gap-2">
            <label htmlFor="switch-component-on" className="text-slate-600 text-sm cursor-pointer">Pending</label>
            <div className="relative inline-block w-11 h-5">
                <input id="switch-component-on" onClick={props.onClick} type="checkbox" className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" />
                <label htmlFor="switch-component-on" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer">
                </label>
            </div>

            <label htmlFor="switch-component-on" className="text-slate-600 text-sm cursor-pointer">Finished</label>
        </div>
    );
};
export default Toggle;
