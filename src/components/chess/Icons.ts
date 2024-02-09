import bb from './assets/img/pieces/burnett/bb.svg';
import bk from './assets/img/pieces/burnett/bk.svg';
import bn from './assets/img/pieces/burnett/bn.svg';
import bp from './assets/img/pieces/burnett/bp.svg';
import bq from './assets/img/pieces/burnett/bq.svg';
import br from './assets/img/pieces/burnett/br.svg';
import wb from './assets/img/pieces/burnett/wb.svg';
import wk from './assets/img/pieces/burnett/wk.svg';
import wn from './assets/img/pieces/burnett/wn.svg';
import wp from './assets/img/pieces/burnett/wp.svg';
import wq from './assets/img/pieces/burnett/wq.svg';
import wr from './assets/img/pieces/burnett/wr.svg';

import win from "./assets/img/results/win.svg";
import loose from "./assets/img/results/loose.svg";

export default class Icons{
    static Win = win;
    static Loose = loose;

    static PieceUrl:Record<string, string> = {
        ["b"]: bb,
        ["k"]: bk,
        ["n"]: bn,
        ["p"]: bp,
        ["q"]: bq,
        ["r"]: br,
        ["B"]: wb,
        ["K"]: wk,
        ["N"]: wn,
        ["P"]: wp,
        ["Q"]: wq,
        ["R"]: wr
    };
}