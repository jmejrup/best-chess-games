"use strict";
(self["webpackChunkbest_chess_games"] = self["webpackChunkbest_chess_games"] || []).push([["openings"],{

/***/ "./node_modules/chess.js/dist/esm/chess.js":
/*!*************************************************!*\
  !*** ./node_modules/chess.js/dist/esm/chess.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BISHOP: () => (/* binding */ BISHOP),
/* harmony export */   BLACK: () => (/* binding */ BLACK),
/* harmony export */   Chess: () => (/* binding */ Chess),
/* harmony export */   DEFAULT_POSITION: () => (/* binding */ DEFAULT_POSITION),
/* harmony export */   KING: () => (/* binding */ KING),
/* harmony export */   KNIGHT: () => (/* binding */ KNIGHT),
/* harmony export */   PAWN: () => (/* binding */ PAWN),
/* harmony export */   QUEEN: () => (/* binding */ QUEEN),
/* harmony export */   ROOK: () => (/* binding */ ROOK),
/* harmony export */   SQUARES: () => (/* binding */ SQUARES),
/* harmony export */   WHITE: () => (/* binding */ WHITE),
/* harmony export */   validateFen: () => (/* binding */ validateFen)
/* harmony export */ });
/**
 * @license
 * Copyright (c) 2023, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const WHITE = 'w';
const BLACK = 'b';
const PAWN = 'p';
const KNIGHT = 'n';
const BISHOP = 'b';
const ROOK = 'r';
const QUEEN = 'q';
const KING = 'k';
const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const EMPTY = -1;
const FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
};
// prettier-ignore
const SQUARES = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
];
const BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64,
};
/*
 * NOTES ABOUT 0x88 MOVE GENERATION ALGORITHM
 * ----------------------------------------------------------------------------
 * From https://github.com/jhlywa/chess.js/issues/230
 *
 * A lot of people are confused when they first see the internal representation
 * of chess.js. It uses the 0x88 Move Generation Algorithm which internally
 * stores the board as an 8x16 array. This is purely for efficiency but has a
 * couple of interesting benefits:
 *
 * 1. 0x88 offers a very inexpensive "off the board" check. Bitwise AND (&) any
 *    square with 0x88, if the result is non-zero then the square is off the
 *    board. For example, assuming a knight square A8 (0 in 0x88 notation),
 *    there are 8 possible directions in which the knight can move. These
 *    directions are relative to the 8x16 board and are stored in the
 *    PIECE_OFFSETS map. One possible move is A8 - 18 (up one square, and two
 *    squares to the left - which is off the board). 0 - 18 = -18 & 0x88 = 0x88
 *    (because of two-complement representation of -18). The non-zero result
 *    means the square is off the board and the move is illegal. Take the
 *    opposite move (from A8 to C7), 0 + 18 = 18 & 0x88 = 0. A result of zero
 *    means the square is on the board.
 *
 * 2. The relative distance (or difference) between two squares on a 8x16 board
 *    is unique and can be used to inexpensively determine if a piece on a
 *    square can attack any other arbitrary square. For example, let's see if a
 *    pawn on E7 can attack E2. The difference between E7 (20) - E2 (100) is
 *    -80. We add 119 to make the ATTACKS array index non-negative (because the
 *    worst case difference is A8 - H1 = -119). The ATTACKS array contains a
 *    bitmask of pieces that can attack from that distance and direction.
 *    ATTACKS[-80 + 119=39] gives us 24 or 0b11000 in binary. Look at the
 *    PIECE_MASKS map to determine the mask for a given piece type. In our pawn
 *    example, we would check to see if 24 & 0x1 is non-zero, which it is
 *    not. So, naturally, a pawn on E7 can't attack a piece on E2. However, a
 *    rook can since 24 & 0x8 is non-zero. The only thing left to check is that
 *    there are no blocking pieces between E7 and E2. That's where the RAYS
 *    array comes in. It provides an offset (in this case 16) to add to E7 (20)
 *    to check for blocking pieces. E7 (20) + 16 = E6 (36) + 16 = E5 (52) etc.
 */
// prettier-ignore
// eslint-disable-next-line
const Ox88 = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
const PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15],
};
const PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1],
};
// prettier-ignore
const ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
];
// prettier-ignore
const RAYS = [
    17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
    0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
    0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
    0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
    0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
    0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
    0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
    0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
    0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
    -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];
const PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 };
const SYMBOLS = 'pnbrqkPNBRQK';
const PROMOTIONS = [KNIGHT, BISHOP, ROOK, QUEEN];
const RANK_1 = 7;
const RANK_2 = 6;
/*
 * const RANK_3 = 5
 * const RANK_4 = 4
 * const RANK_5 = 3
 * const RANK_6 = 2
 */
const RANK_7 = 1;
const RANK_8 = 0;
const SIDES = {
    [KING]: BITS.KSIDE_CASTLE,
    [QUEEN]: BITS.QSIDE_CASTLE,
};
const ROOKS = {
    w: [
        { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h1, flag: BITS.KSIDE_CASTLE },
    ],
    b: [
        { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h8, flag: BITS.KSIDE_CASTLE },
    ],
};
const SECOND_RANK = { b: RANK_7, w: RANK_2 };
const TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*'];
// Extracts the zero-based rank of an 0x88 square.
function rank(square) {
    return square >> 4;
}
// Extracts the zero-based file of an 0x88 square.
function file(square) {
    return square & 0xf;
}
function isDigit(c) {
    return '0123456789'.indexOf(c) !== -1;
}
// Converts a 0x88 square to algebraic notation.
function algebraic(square) {
    const f = file(square);
    const r = rank(square);
    return ('abcdefgh'.substring(f, f + 1) +
        '87654321'.substring(r, r + 1));
}
function swapColor(color) {
    return color === WHITE ? BLACK : WHITE;
}
function validateFen(fen) {
    // 1st criterion: 6 space-seperated fields?
    const tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
        return {
            ok: false,
            error: 'Invalid FEN: must contain six space-delimited fields',
        };
    }
    // 2nd criterion: move number field is a integer value > 0?
    const moveNumber = parseInt(tokens[5], 10);
    if (isNaN(moveNumber) || moveNumber <= 0) {
        return {
            ok: false,
            error: 'Invalid FEN: move number must be a positive integer',
        };
    }
    // 3rd criterion: half move counter is an integer >= 0?
    const halfMoves = parseInt(tokens[4], 10);
    if (isNaN(halfMoves) || halfMoves < 0) {
        return {
            ok: false,
            error: 'Invalid FEN: half move counter number must be a non-negative integer',
        };
    }
    // 4th criterion: 4th field is a valid e.p.-string?
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return { ok: false, error: 'Invalid FEN: en-passant square is invalid' };
    }
    // 5th criterion: 3th field is a valid castle-string?
    if (/[^kKqQ-]/.test(tokens[2])) {
        return { ok: false, error: 'Invalid FEN: castling availability is invalid' };
    }
    // 6th criterion: 2nd field is "w" (white) or "b" (black)?
    if (!/^(w|b)$/.test(tokens[1])) {
        return { ok: false, error: 'Invalid FEN: side-to-move is invalid' };
    }
    // 7th criterion: 1st field contains 8 rows?
    const rows = tokens[0].split('/');
    if (rows.length !== 8) {
        return {
            ok: false,
            error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
        };
    }
    // 8th criterion: every row is valid?
    for (let i = 0; i < rows.length; i++) {
        // check for right sum of fields AND not two numbers in succession
        let sumFields = 0;
        let previousWasNumber = false;
        for (let k = 0; k < rows[i].length; k++) {
            if (isDigit(rows[i][k])) {
                if (previousWasNumber) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (consecutive number)',
                    };
                }
                sumFields += parseInt(rows[i][k], 10);
                previousWasNumber = true;
            }
            else {
                if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (invalid piece)',
                    };
                }
                sumFields += 1;
                previousWasNumber = false;
            }
        }
        if (sumFields !== 8) {
            return {
                ok: false,
                error: 'Invalid FEN: piece data is invalid (too many squares in rank)',
            };
        }
    }
    // 9th criterion: is en-passant square legal?
    if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')) {
        return { ok: false, error: 'Invalid FEN: illegal en-passant square' };
    }
    // 10th criterion: does chess position contain exact two kings?
    const kings = [
        { color: 'white', regex: /K/g },
        { color: 'black', regex: /k/g },
    ];
    for (const { color, regex } of kings) {
        if (!regex.test(tokens[0])) {
            return { ok: false, error: `Invalid FEN: missing ${color} king` };
        }
        if ((tokens[0].match(regex) || []).length > 1) {
            return { ok: false, error: `Invalid FEN: too many ${color} kings` };
        }
    }
    // 11th criterion: are any pawns on the first or eighth rows?
    if (Array.from(rows[0] + rows[7]).some((char) => char.toUpperCase() === 'P')) {
        return {
            ok: false,
            error: 'Invalid FEN: some pawns are on the edge rows',
        };
    }
    return { ok: true };
}
// this function is used to uniquely identify ambiguous moves
function getDisambiguator(move, moves) {
    const from = move.from;
    const to = move.to;
    const piece = move.piece;
    let ambiguities = 0;
    let sameRank = 0;
    let sameFile = 0;
    for (let i = 0, len = moves.length; i < len; i++) {
        const ambigFrom = moves[i].from;
        const ambigTo = moves[i].to;
        const ambigPiece = moves[i].piece;
        /*
         * if a move of the same piece type ends on the same to square, we'll need
         * to add a disambiguator to the algebraic notation
         */
        if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
            ambiguities++;
            if (rank(from) === rank(ambigFrom)) {
                sameRank++;
            }
            if (file(from) === file(ambigFrom)) {
                sameFile++;
            }
        }
    }
    if (ambiguities > 0) {
        if (sameRank > 0 && sameFile > 0) {
            /*
             * if there exists a similar moving piece on the same rank and file as
             * the move in question, use the square as the disambiguator
             */
            return algebraic(from);
        }
        else if (sameFile > 0) {
            /*
             * if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            return algebraic(from).charAt(1);
        }
        else {
            // else use the file symbol
            return algebraic(from).charAt(0);
        }
    }
    return '';
}
function addMove(moves, color, from, to, piece, captured = undefined, flags = BITS.NORMAL) {
    const r = rank(to);
    if (piece === PAWN && (r === RANK_1 || r === RANK_8)) {
        for (let i = 0; i < PROMOTIONS.length; i++) {
            const promotion = PROMOTIONS[i];
            moves.push({
                color,
                from,
                to,
                piece,
                captured,
                promotion,
                flags: flags | BITS.PROMOTION,
            });
        }
    }
    else {
        moves.push({
            color,
            from,
            to,
            piece,
            captured,
            flags,
        });
    }
}
function inferPieceType(san) {
    let pieceType = san.charAt(0);
    if (pieceType >= 'a' && pieceType <= 'h') {
        const matches = san.match(/[a-h]\d.*[a-h]\d/);
        if (matches) {
            return undefined;
        }
        return PAWN;
    }
    pieceType = pieceType.toLowerCase();
    if (pieceType === 'o') {
        return KING;
    }
    return pieceType;
}
// parses all of the decorators out of a SAN string
function strippedSan(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
}
function trimFen(fen) {
    /*
     * remove last two fields in FEN string as they're not needed when checking
     * for repetition
     */
    return fen.split(' ').slice(0, 4).join(' ');
}
class Chess {
    _board = new Array(128);
    _turn = WHITE;
    _header = {};
    _kings = { w: EMPTY, b: EMPTY };
    _epSquare = -1;
    _halfMoves = 0;
    _moveNumber = 0;
    _history = [];
    _comments = {};
    _castling = { w: 0, b: 0 };
    _positionCounts = {};
    constructor(fen = DEFAULT_POSITION) {
        this.load(fen);
    }
    clear({ preserveHeaders = false } = {}) {
        this._board = new Array(128);
        this._kings = { w: EMPTY, b: EMPTY };
        this._turn = WHITE;
        this._castling = { w: 0, b: 0 };
        this._epSquare = EMPTY;
        this._halfMoves = 0;
        this._moveNumber = 1;
        this._history = [];
        this._comments = {};
        this._header = preserveHeaders ? this._header : {};
        /*
         * Delete the SetUp and FEN headers (if preserved), the board is empty and
         * these headers don't make sense in this state. They'll get added later
         * via .load() or .put()
         */
        delete this._header['SetUp'];
        delete this._header['FEN'];
        /*
         * Instantiate a proxy that keeps track of position occurrence counts for the purpose
         * of repetition checking. The getter and setter methods automatically handle trimming
         * irrelevent information from the fen, initialising new positions, and removing old
         * positions from the record if their counts are reduced to 0.
         */
        this._positionCounts = new Proxy({}, {
            get: (target, position) => position === 'length'
                ? Object.keys(target).length // length for unit testing
                : target?.[trimFen(position)] || 0,
            set: (target, position, count) => {
                const trimmedFen = trimFen(position);
                if (count === 0)
                    delete target[trimmedFen];
                else
                    target[trimmedFen] = count;
                return true;
            },
        });
    }
    removeHeader(key) {
        if (key in this._header) {
            delete this._header[key];
        }
    }
    load(fen, { skipValidation = false, preserveHeaders = false } = {}) {
        let tokens = fen.split(/\s+/);
        // append commonly omitted fen tokens
        if (tokens.length >= 2 && tokens.length < 6) {
            const adjustments = ['-', '-', '0', '1'];
            fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(' ');
        }
        tokens = fen.split(/\s+/);
        if (!skipValidation) {
            const { ok, error } = validateFen(fen);
            if (!ok) {
                throw new Error(error);
            }
        }
        const position = tokens[0];
        let square = 0;
        this.clear({ preserveHeaders });
        for (let i = 0; i < position.length; i++) {
            const piece = position.charAt(i);
            if (piece === '/') {
                square += 8;
            }
            else if (isDigit(piece)) {
                square += parseInt(piece, 10);
            }
            else {
                const color = piece < 'a' ? WHITE : BLACK;
                this._put({ type: piece.toLowerCase(), color }, algebraic(square));
                square++;
            }
        }
        this._turn = tokens[1];
        if (tokens[2].indexOf('K') > -1) {
            this._castling.w |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('Q') > -1) {
            this._castling.w |= BITS.QSIDE_CASTLE;
        }
        if (tokens[2].indexOf('k') > -1) {
            this._castling.b |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('q') > -1) {
            this._castling.b |= BITS.QSIDE_CASTLE;
        }
        this._epSquare = tokens[3] === '-' ? EMPTY : Ox88[tokens[3]];
        this._halfMoves = parseInt(tokens[4], 10);
        this._moveNumber = parseInt(tokens[5], 10);
        this._updateSetup(fen);
        this._positionCounts[fen]++;
    }
    fen() {
        let empty = 0;
        let fen = '';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i]) {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                const { color, type: piece } = this._board[i];
                fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            }
            else {
                empty++;
            }
            if ((i + 1) & 0x88) {
                if (empty > 0) {
                    fen += empty;
                }
                if (i !== Ox88.h1) {
                    fen += '/';
                }
                empty = 0;
                i += 8;
            }
        }
        let castling = '';
        if (this._castling[WHITE] & BITS.KSIDE_CASTLE) {
            castling += 'K';
        }
        if (this._castling[WHITE] & BITS.QSIDE_CASTLE) {
            castling += 'Q';
        }
        if (this._castling[BLACK] & BITS.KSIDE_CASTLE) {
            castling += 'k';
        }
        if (this._castling[BLACK] & BITS.QSIDE_CASTLE) {
            castling += 'q';
        }
        // do we have an empty castling flag?
        castling = castling || '-';
        let epSquare = '-';
        /*
         * only print the ep square if en passant is a valid move (pawn is present
         * and ep capture is not pinned)
         */
        if (this._epSquare !== EMPTY) {
            const bigPawnSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
            const squares = [bigPawnSquare + 1, bigPawnSquare - 1];
            for (const square of squares) {
                // is the square off the board?
                if (square & 0x88) {
                    continue;
                }
                const color = this._turn;
                // is there a pawn that can capture the epSquare?
                if (this._board[square]?.color === color &&
                    this._board[square]?.type === PAWN) {
                    // if the pawn makes an ep capture, does it leave it's king in check?
                    this._makeMove({
                        color,
                        from: square,
                        to: this._epSquare,
                        piece: PAWN,
                        captured: PAWN,
                        flags: BITS.EP_CAPTURE,
                    });
                    const isLegal = !this._isKingAttacked(color);
                    this._undoMove();
                    // if ep is legal, break and set the ep square in the FEN output
                    if (isLegal) {
                        epSquare = algebraic(this._epSquare);
                        break;
                    }
                }
            }
        }
        return [
            fen,
            this._turn,
            castling,
            epSquare,
            this._halfMoves,
            this._moveNumber,
        ].join(' ');
    }
    /*
     * Called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object. If the FEN
     * is equal to the default position, the SetUp and FEN are deleted the setup
     * is only updated if history.length is zero, ie moves haven't been made.
     */
    _updateSetup(fen) {
        if (this._history.length > 0)
            return;
        if (fen !== DEFAULT_POSITION) {
            this._header['SetUp'] = '1';
            this._header['FEN'] = fen;
        }
        else {
            delete this._header['SetUp'];
            delete this._header['FEN'];
        }
    }
    reset() {
        this.load(DEFAULT_POSITION);
    }
    get(square) {
        return this._board[Ox88[square]] || false;
    }
    put({ type, color }, square) {
        if (this._put({ type, color }, square)) {
            this._updateCastlingRights();
            this._updateEnPassantSquare();
            this._updateSetup(this.fen());
            return true;
        }
        return false;
    }
    _put({ type, color }, square) {
        // check for piece
        if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
            return false;
        }
        // check for valid square
        if (!(square in Ox88)) {
            return false;
        }
        const sq = Ox88[square];
        // don't let the user place more than one king
        if (type == KING &&
            !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
            return false;
        }
        const currentPieceOnSquare = this._board[sq];
        // if one of the kings will be replaced by the piece from args, set the `_kings` respective entry to `EMPTY`
        if (currentPieceOnSquare && currentPieceOnSquare.type === KING) {
            this._kings[currentPieceOnSquare.color] = EMPTY;
        }
        this._board[sq] = { type: type, color: color };
        if (type === KING) {
            this._kings[color] = sq;
        }
        return true;
    }
    remove(square) {
        const piece = this.get(square);
        delete this._board[Ox88[square]];
        if (piece && piece.type === KING) {
            this._kings[piece.color] = EMPTY;
        }
        this._updateCastlingRights();
        this._updateEnPassantSquare();
        this._updateSetup(this.fen());
        return piece;
    }
    _updateCastlingRights() {
        const whiteKingInPlace = this._board[Ox88.e1]?.type === KING &&
            this._board[Ox88.e1]?.color === WHITE;
        const blackKingInPlace = this._board[Ox88.e8]?.type === KING &&
            this._board[Ox88.e8]?.color === BLACK;
        if (!whiteKingInPlace ||
            this._board[Ox88.a1]?.type !== ROOK ||
            this._board[Ox88.a1]?.color !== WHITE) {
            this._castling.w &= ~BITS.QSIDE_CASTLE;
        }
        if (!whiteKingInPlace ||
            this._board[Ox88.h1]?.type !== ROOK ||
            this._board[Ox88.h1]?.color !== WHITE) {
            this._castling.w &= ~BITS.KSIDE_CASTLE;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.a8]?.type !== ROOK ||
            this._board[Ox88.a8]?.color !== BLACK) {
            this._castling.b &= ~BITS.QSIDE_CASTLE;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.h8]?.type !== ROOK ||
            this._board[Ox88.h8]?.color !== BLACK) {
            this._castling.b &= ~BITS.KSIDE_CASTLE;
        }
    }
    _updateEnPassantSquare() {
        if (this._epSquare === EMPTY) {
            return;
        }
        const startSquare = this._epSquare + (this._turn === WHITE ? -16 : 16);
        const currentSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
        const attackers = [currentSquare + 1, currentSquare - 1];
        if (this._board[startSquare] !== null ||
            this._board[this._epSquare] !== null ||
            this._board[currentSquare]?.color !== swapColor(this._turn) ||
            this._board[currentSquare]?.type !== PAWN) {
            this._epSquare = EMPTY;
            return;
        }
        const canCapture = (square) => !(square & 0x88) &&
            this._board[square]?.color === this._turn &&
            this._board[square]?.type === PAWN;
        if (!attackers.some(canCapture)) {
            this._epSquare = EMPTY;
        }
    }
    _attacked(color, square) {
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // did we run off the end of the board
            if (i & 0x88) {
                i += 7;
                continue;
            }
            // if empty square or wrong color
            if (this._board[i] === undefined || this._board[i].color !== color) {
                continue;
            }
            const piece = this._board[i];
            const difference = i - square;
            // skip - to/from square are the same
            if (difference === 0) {
                continue;
            }
            const index = difference + 119;
            if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
                if (piece.type === PAWN) {
                    if (difference > 0) {
                        if (piece.color === WHITE)
                            return true;
                    }
                    else {
                        if (piece.color === BLACK)
                            return true;
                    }
                    continue;
                }
                // if the piece is a knight or a king
                if (piece.type === 'n' || piece.type === 'k')
                    return true;
                const offset = RAYS[index];
                let j = i + offset;
                let blocked = false;
                while (j !== square) {
                    if (this._board[j] != null) {
                        blocked = true;
                        break;
                    }
                    j += offset;
                }
                if (!blocked)
                    return true;
            }
        }
        return false;
    }
    _isKingAttacked(color) {
        const square = this._kings[color];
        return square === -1 ? false : this._attacked(swapColor(color), square);
    }
    isAttacked(square, attackedBy) {
        return this._attacked(attackedBy, Ox88[square]);
    }
    isCheck() {
        return this._isKingAttacked(this._turn);
    }
    inCheck() {
        return this.isCheck();
    }
    isCheckmate() {
        return this.isCheck() && this._moves().length === 0;
    }
    isStalemate() {
        return !this.isCheck() && this._moves().length === 0;
    }
    isInsufficientMaterial() {
        /*
         * k.b. vs k.b. (of opposite colors) with mate in 1:
         * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
         *
         * k.b. vs k.n. with mate in 1:
         * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
         */
        const pieces = {
            b: 0,
            n: 0,
            r: 0,
            q: 0,
            k: 0,
            p: 0,
        };
        const bishops = [];
        let numPieces = 0;
        let squareColor = 0;
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            squareColor = (squareColor + 1) % 2;
            if (i & 0x88) {
                i += 7;
                continue;
            }
            const piece = this._board[i];
            if (piece) {
                pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
                if (piece.type === BISHOP) {
                    bishops.push(squareColor);
                }
                numPieces++;
            }
        }
        // k vs. k
        if (numPieces === 2) {
            return true;
        }
        else if (
        // k vs. kn .... or .... k vs. kb
        numPieces === 3 &&
            (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) {
            return true;
        }
        else if (numPieces === pieces[BISHOP] + 2) {
            // kb vs. kb where any number of bishops are all on the same color
            let sum = 0;
            const len = bishops.length;
            for (let i = 0; i < len; i++) {
                sum += bishops[i];
            }
            if (sum === 0 || sum === len) {
                return true;
            }
        }
        return false;
    }
    _getRepetitionCount() {
        return this._positionCounts[this.fen()];
    }
    isThreefoldRepetition() {
        return this._getRepetitionCount() >= 3;
    }
    isDraw() {
        return (this._halfMoves >= 100 || // 50 moves per side = 100 half moves
            this.isStalemate() ||
            this.isInsufficientMaterial() ||
            this.isThreefoldRepetition());
    }
    isGameOver() {
        return this.isCheckmate() || this.isStalemate() || this.isDraw();
    }
    moves({ verbose = false, square = undefined, piece = undefined, } = {}) {
        const moves = this._moves({ square, piece });
        if (verbose) {
            return moves.map((move) => this._makePretty(move));
        }
        else {
            return moves.map((move) => this._moveToSan(move, moves));
        }
    }
    _moves({ legal = true, piece = undefined, square = undefined, } = {}) {
        const forSquare = square ? square.toLowerCase() : undefined;
        const forPiece = piece?.toLowerCase();
        const moves = [];
        const us = this._turn;
        const them = swapColor(us);
        let firstSquare = Ox88.a8;
        let lastSquare = Ox88.h1;
        let singleSquare = false;
        // are we generating moves for a single square?
        if (forSquare) {
            // illegal square, return empty moves
            if (!(forSquare in Ox88)) {
                return [];
            }
            else {
                firstSquare = lastSquare = Ox88[forSquare];
                singleSquare = true;
            }
        }
        for (let from = firstSquare; from <= lastSquare; from++) {
            // did we run off the end of the board
            if (from & 0x88) {
                from += 7;
                continue;
            }
            // empty square or opponent, skip
            if (!this._board[from] || this._board[from].color === them) {
                continue;
            }
            const { type } = this._board[from];
            let to;
            if (type === PAWN) {
                if (forPiece && forPiece !== type)
                    continue;
                // single square, non-capturing
                to = from + PAWN_OFFSETS[us][0];
                if (!this._board[to]) {
                    addMove(moves, us, from, to, PAWN);
                    // double square
                    to = from + PAWN_OFFSETS[us][1];
                    if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
                        addMove(moves, us, from, to, PAWN, undefined, BITS.BIG_PAWN);
                    }
                }
                // pawn captures
                for (let j = 2; j < 4; j++) {
                    to = from + PAWN_OFFSETS[us][j];
                    if (to & 0x88)
                        continue;
                    if (this._board[to]?.color === them) {
                        addMove(moves, us, from, to, PAWN, this._board[to].type, BITS.CAPTURE);
                    }
                    else if (to === this._epSquare) {
                        addMove(moves, us, from, to, PAWN, PAWN, BITS.EP_CAPTURE);
                    }
                }
            }
            else {
                if (forPiece && forPiece !== type)
                    continue;
                for (let j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
                    const offset = PIECE_OFFSETS[type][j];
                    to = from;
                    while (true) {
                        to += offset;
                        if (to & 0x88)
                            break;
                        if (!this._board[to]) {
                            addMove(moves, us, from, to, type);
                        }
                        else {
                            // own color, stop loop
                            if (this._board[to].color === us)
                                break;
                            addMove(moves, us, from, to, type, this._board[to].type, BITS.CAPTURE);
                            break;
                        }
                        /* break, if knight or king */
                        if (type === KNIGHT || type === KING)
                            break;
                    }
                }
            }
        }
        /*
         * check for castling if we're:
         *   a) generating all moves, or
         *   b) doing single square move generation on the king's square
         */
        if (forPiece === undefined || forPiece === KING) {
            if (!singleSquare || lastSquare === this._kings[us]) {
                // king-side castling
                if (this._castling[us] & BITS.KSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom + 2;
                    if (!this._board[castlingFrom + 1] &&
                        !this._board[castlingTo] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom + 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.KSIDE_CASTLE);
                    }
                }
                // queen-side castling
                if (this._castling[us] & BITS.QSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom - 2;
                    if (!this._board[castlingFrom - 1] &&
                        !this._board[castlingFrom - 2] &&
                        !this._board[castlingFrom - 3] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom - 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.QSIDE_CASTLE);
                    }
                }
            }
        }
        /*
         * return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */
        if (!legal || this._kings[us] === -1) {
            return moves;
        }
        // filter out illegal moves
        const legalMoves = [];
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(us)) {
                legalMoves.push(moves[i]);
            }
            this._undoMove();
        }
        return legalMoves;
    }
    move(move, { strict = false } = {}) {
        /*
         * The move function can be called with in the following parameters:
         *
         * .move('Nxb7')       <- argument is a case-sensitive SAN string
         *
         * .move({ from: 'h7', <- argument is a move object
         *         to :'h8',
         *         promotion: 'q' })
         *
         *
         * An optional strict argument may be supplied to tell chess.js to
         * strictly follow the SAN specification.
         */
        let moveObj = null;
        if (typeof move === 'string') {
            moveObj = this._moveFromSan(move, strict);
        }
        else if (typeof move === 'object') {
            const moves = this._moves();
            // convert the pretty move object to an ugly move object
            for (let i = 0, len = moves.length; i < len; i++) {
                if (move.from === algebraic(moves[i].from) &&
                    move.to === algebraic(moves[i].to) &&
                    (!('promotion' in moves[i]) || move.promotion === moves[i].promotion)) {
                    moveObj = moves[i];
                    break;
                }
            }
        }
        // failed to find move
        if (!moveObj) {
            if (typeof move === 'string') {
                throw new Error(`Invalid move: ${move}`);
            }
            else {
                throw new Error(`Invalid move: ${JSON.stringify(move)}`);
            }
        }
        /*
         * need to make a copy of move because we can't generate SAN after the move
         * is made
         */
        const prettyMove = this._makePretty(moveObj);
        this._makeMove(moveObj);
        this._positionCounts[prettyMove.after]++;
        return prettyMove;
    }
    _push(move) {
        this._history.push({
            move,
            kings: { b: this._kings.b, w: this._kings.w },
            turn: this._turn,
            castling: { b: this._castling.b, w: this._castling.w },
            epSquare: this._epSquare,
            halfMoves: this._halfMoves,
            moveNumber: this._moveNumber,
        });
    }
    _makeMove(move) {
        const us = this._turn;
        const them = swapColor(us);
        this._push(move);
        this._board[move.to] = this._board[move.from];
        delete this._board[move.from];
        // if ep capture, remove the captured pawn
        if (move.flags & BITS.EP_CAPTURE) {
            if (this._turn === BLACK) {
                delete this._board[move.to - 16];
            }
            else {
                delete this._board[move.to + 16];
            }
        }
        // if pawn promotion, replace with new piece
        if (move.promotion) {
            this._board[move.to] = { type: move.promotion, color: us };
        }
        // if we moved the king
        if (this._board[move.to].type === KING) {
            this._kings[us] = move.to;
            // if we castled, move the rook next to the king
            if (move.flags & BITS.KSIDE_CASTLE) {
                const castlingTo = move.to - 1;
                const castlingFrom = move.to + 1;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            else if (move.flags & BITS.QSIDE_CASTLE) {
                const castlingTo = move.to + 1;
                const castlingFrom = move.to - 2;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            // turn off castling
            this._castling[us] = 0;
        }
        // turn off castling if we move a rook
        if (this._castling[us]) {
            for (let i = 0, len = ROOKS[us].length; i < len; i++) {
                if (move.from === ROOKS[us][i].square &&
                    this._castling[us] & ROOKS[us][i].flag) {
                    this._castling[us] ^= ROOKS[us][i].flag;
                    break;
                }
            }
        }
        // turn off castling if we capture a rook
        if (this._castling[them]) {
            for (let i = 0, len = ROOKS[them].length; i < len; i++) {
                if (move.to === ROOKS[them][i].square &&
                    this._castling[them] & ROOKS[them][i].flag) {
                    this._castling[them] ^= ROOKS[them][i].flag;
                    break;
                }
            }
        }
        // if big pawn move, update the en passant square
        if (move.flags & BITS.BIG_PAWN) {
            if (us === BLACK) {
                this._epSquare = move.to - 16;
            }
            else {
                this._epSquare = move.to + 16;
            }
        }
        else {
            this._epSquare = EMPTY;
        }
        // reset the 50 move counter if a pawn is moved or a piece is captured
        if (move.piece === PAWN) {
            this._halfMoves = 0;
        }
        else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            this._halfMoves = 0;
        }
        else {
            this._halfMoves++;
        }
        if (us === BLACK) {
            this._moveNumber++;
        }
        this._turn = them;
    }
    undo() {
        const move = this._undoMove();
        if (move) {
            const prettyMove = this._makePretty(move);
            this._positionCounts[prettyMove.after]--;
            return prettyMove;
        }
        return null;
    }
    _undoMove() {
        const old = this._history.pop();
        if (old === undefined) {
            return null;
        }
        const move = old.move;
        this._kings = old.kings;
        this._turn = old.turn;
        this._castling = old.castling;
        this._epSquare = old.epSquare;
        this._halfMoves = old.halfMoves;
        this._moveNumber = old.moveNumber;
        const us = this._turn;
        const them = swapColor(us);
        this._board[move.from] = this._board[move.to];
        this._board[move.from].type = move.piece; // to undo any promotions
        delete this._board[move.to];
        if (move.captured) {
            if (move.flags & BITS.EP_CAPTURE) {
                // en passant capture
                let index;
                if (us === BLACK) {
                    index = move.to - 16;
                }
                else {
                    index = move.to + 16;
                }
                this._board[index] = { type: PAWN, color: them };
            }
            else {
                // regular capture
                this._board[move.to] = { type: move.captured, color: them };
            }
        }
        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
            let castlingTo, castlingFrom;
            if (move.flags & BITS.KSIDE_CASTLE) {
                castlingTo = move.to + 1;
                castlingFrom = move.to - 1;
            }
            else {
                castlingTo = move.to - 2;
                castlingFrom = move.to + 1;
            }
            this._board[castlingTo] = this._board[castlingFrom];
            delete this._board[castlingFrom];
        }
        return move;
    }
    pgn({ newline = '\n', maxWidth = 0, } = {}) {
        /*
         * using the specification from http://www.chessclub.com/help/PGN-spec
         * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
         */
        const result = [];
        let headerExists = false;
        /* add the PGN header information */
        for (const i in this._header) {
            /*
             * TODO: order of enumerated properties in header object is not
             * guaranteed, see ECMA-262 spec (section 12.6.4)
             */
            result.push('[' + i + ' "' + this._header[i] + '"]' + newline);
            headerExists = true;
        }
        if (headerExists && this._history.length) {
            result.push(newline);
        }
        const appendComment = (moveString) => {
            const comment = this._comments[this.fen()];
            if (typeof comment !== 'undefined') {
                const delimiter = moveString.length > 0 ? ' ' : '';
                moveString = `${moveString}${delimiter}{${comment}}`;
            }
            return moveString;
        };
        // pop all of history onto reversed_history
        const reversedHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        const moves = [];
        let moveString = '';
        // special case of a commented starting position with no moves
        if (reversedHistory.length === 0) {
            moves.push(appendComment(''));
        }
        // build the list of moves.  a move_string looks like: "3. e3 e6"
        while (reversedHistory.length > 0) {
            moveString = appendComment(moveString);
            const move = reversedHistory.pop();
            // make TypeScript stop complaining about move being undefined
            if (!move) {
                break;
            }
            // if the position started with black to move, start PGN with #. ...
            if (!this._history.length && move.color === 'b') {
                const prefix = `${this._moveNumber}. ...`;
                // is there a comment preceding the first move?
                moveString = moveString ? `${moveString} ${prefix}` : prefix;
            }
            else if (move.color === 'w') {
                // store the previous generated move_string if we have one
                if (moveString.length) {
                    moves.push(moveString);
                }
                moveString = this._moveNumber + '.';
            }
            moveString =
                moveString + ' ' + this._moveToSan(move, this._moves({ legal: true }));
            this._makeMove(move);
        }
        // are there any other leftover moves?
        if (moveString.length) {
            moves.push(appendComment(moveString));
        }
        // is there a result?
        if (typeof this._header.Result !== 'undefined') {
            moves.push(this._header.Result);
        }
        /*
         * history should be back to what it was before we started generating PGN,
         * so join together moves
         */
        if (maxWidth === 0) {
            return result.join('') + moves.join(' ');
        }
        // TODO (jah): huh?
        const strip = function () {
            if (result.length > 0 && result[result.length - 1] === ' ') {
                result.pop();
                return true;
            }
            return false;
        };
        // NB: this does not preserve comment whitespace.
        const wrapComment = function (width, move) {
            for (const token of move.split(' ')) {
                if (!token) {
                    continue;
                }
                if (width + token.length > maxWidth) {
                    while (strip()) {
                        width--;
                    }
                    result.push(newline);
                    width = 0;
                }
                result.push(token);
                width += token.length;
                result.push(' ');
                width++;
            }
            if (strip()) {
                width--;
            }
            return width;
        };
        // wrap the PGN output at max_width
        let currentWidth = 0;
        for (let i = 0; i < moves.length; i++) {
            if (currentWidth + moves[i].length > maxWidth) {
                if (moves[i].includes('{')) {
                    currentWidth = wrapComment(currentWidth, moves[i]);
                    continue;
                }
            }
            // if the current move will push past max_width
            if (currentWidth + moves[i].length > maxWidth && i !== 0) {
                // don't end the line with whitespace
                if (result[result.length - 1] === ' ') {
                    result.pop();
                }
                result.push(newline);
                currentWidth = 0;
            }
            else if (i !== 0) {
                result.push(' ');
                currentWidth++;
            }
            result.push(moves[i]);
            currentWidth += moves[i].length;
        }
        return result.join('');
    }
    header(...args) {
        for (let i = 0; i < args.length; i += 2) {
            if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
                this._header[args[i]] = args[i + 1];
            }
        }
        return this._header;
    }
    loadPgn(pgn, { strict = false, newlineChar = '\r?\n', } = {}) {
        function mask(str) {
            return str.replace(/\\/g, '\\');
        }
        function parsePgnHeader(header) {
            const headerObj = {};
            const headers = header.split(new RegExp(mask(newlineChar)));
            let key = '';
            let value = '';
            for (let i = 0; i < headers.length; i++) {
                const regex = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
                key = headers[i].replace(regex, '$1');
                value = headers[i].replace(regex, '$2');
                if (key.trim().length > 0) {
                    headerObj[key] = value;
                }
            }
            return headerObj;
        }
        // strip whitespace from head/tail of PGN block
        pgn = pgn.trim();
        /*
         * RegExp to split header. Takes advantage of the fact that header and movetext
         * will always have a blank line between them (ie, two newline_char's). Handles
         * case where movetext is empty by matching newlineChar until end of string is
         * matched - effectively trimming from the end extra newlineChar.
         *
         * With default newline_char, will equal:
         * /^(\[((?:\r?\n)|.)*\])((?:\s*\r?\n){2}|(?:\s*\r?\n)*$)/
         */
        const headerRegex = new RegExp('^(\\[((?:' +
            mask(newlineChar) +
            ')|.)*\\])' +
            '((?:\\s*' +
            mask(newlineChar) +
            '){2}|(?:\\s*' +
            mask(newlineChar) +
            ')*$)');
        // If no header given, begin with moves.
        const headerRegexResults = headerRegex.exec(pgn);
        const headerString = headerRegexResults
            ? headerRegexResults.length >= 2
                ? headerRegexResults[1]
                : ''
            : '';
        // Put the board in the starting position
        this.reset();
        // parse PGN header
        const headers = parsePgnHeader(headerString);
        let fen = '';
        for (const key in headers) {
            // check to see user is including fen (possibly with wrong tag case)
            if (key.toLowerCase() === 'fen') {
                fen = headers[key];
            }
            this.header(key, headers[key]);
        }
        /*
         * the permissive parser should attempt to load a fen tag, even if it's the
         * wrong case and doesn't include a corresponding [SetUp "1"] tag
         */
        if (!strict) {
            if (fen) {
                this.load(fen, { preserveHeaders: true });
            }
        }
        else {
            /*
             * strict parser - load the starting position indicated by [Setup '1']
             * and [FEN position]
             */
            if (headers['SetUp'] === '1') {
                if (!('FEN' in headers)) {
                    throw new Error('Invalid PGN: FEN tag must be supplied with SetUp tag');
                }
                // don't clear the headers when loading
                this.load(headers['FEN'], { preserveHeaders: true });
            }
        }
        /*
         * NB: the regexes below that delete move numbers, recursive annotations,
         * and numeric annotation glyphs may also match text in comments. To
         * prevent this, we transform comments by hex-encoding them in place and
         * decoding them again after the other tokens have been deleted.
         *
         * While the spec states that PGN files should be ASCII encoded, we use
         * {en,de}codeURIComponent here to support arbitrary UTF8 as a convenience
         * for modern users
         */
        function toHex(s) {
            return Array.from(s)
                .map(function (c) {
                /*
                 * encodeURI doesn't transform most ASCII characters, so we handle
                 * these ourselves
                 */
                return c.charCodeAt(0) < 128
                    ? c.charCodeAt(0).toString(16)
                    : encodeURIComponent(c).replace(/%/g, '').toLowerCase();
            })
                .join('');
        }
        function fromHex(s) {
            return s.length == 0
                ? ''
                : decodeURIComponent('%' + (s.match(/.{1,2}/g) || []).join('%'));
        }
        const encodeComment = function (s) {
            s = s.replace(new RegExp(mask(newlineChar), 'g'), ' ');
            return `{${toHex(s.slice(1, s.length - 1))}}`;
        };
        const decodeComment = function (s) {
            if (s.startsWith('{') && s.endsWith('}')) {
                return fromHex(s.slice(1, s.length - 1));
            }
        };
        // delete header to get the moves
        let ms = pgn
            .replace(headerString, '')
            .replace(
        // encode comments so they don't get deleted below
        new RegExp(`({[^}]*})+?|;([^${mask(newlineChar)}]*)`, 'g'), function (_match, bracket, semicolon) {
            return bracket !== undefined
                ? encodeComment(bracket)
                : ' ' + encodeComment(`{${semicolon.slice(1)}}`);
        })
            .replace(new RegExp(mask(newlineChar), 'g'), ' ');
        // delete recursive annotation variations
        const ravRegex = /(\([^()]+\))+?/g;
        while (ravRegex.test(ms)) {
            ms = ms.replace(ravRegex, '');
        }
        // delete move numbers
        ms = ms.replace(/\d+\.(\.\.)?/g, '');
        // delete ... indicating black to move
        ms = ms.replace(/\.\.\./g, '');
        /* delete numeric annotation glyphs */
        ms = ms.replace(/\$\d+/g, '');
        // trim and get array of moves
        let moves = ms.trim().split(new RegExp(/\s+/));
        // delete empty entries
        moves = moves.filter((move) => move !== '');
        let result = '';
        for (let halfMove = 0; halfMove < moves.length; halfMove++) {
            const comment = decodeComment(moves[halfMove]);
            if (comment !== undefined) {
                this._comments[this.fen()] = comment;
                continue;
            }
            const move = this._moveFromSan(moves[halfMove], strict);
            // invalid move
            if (move == null) {
                // was the move an end of game marker
                if (TERMINATION_MARKERS.indexOf(moves[halfMove]) > -1) {
                    result = moves[halfMove];
                }
                else {
                    throw new Error(`Invalid move in PGN: ${moves[halfMove]}`);
                }
            }
            else {
                // reset the end of game marker if making a valid move
                result = '';
                this._makeMove(move);
                this._positionCounts[this.fen()]++;
            }
        }
        /*
         * Per section 8.2.6 of the PGN spec, the Result tag pair must match match
         * the termination marker. Only do this when headers are present, but the
         * result tag is missing
         */
        if (result && Object.keys(this._header).length && !this._header['Result']) {
            this.header('Result', result);
        }
    }
    /*
     * Convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} strict Use the strict SAN parser. It will throw errors
     * on overly disambiguated moves (see below):
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    _moveToSan(move, moves) {
        let output = '';
        if (move.flags & BITS.KSIDE_CASTLE) {
            output = 'O-O';
        }
        else if (move.flags & BITS.QSIDE_CASTLE) {
            output = 'O-O-O';
        }
        else {
            if (move.piece !== PAWN) {
                const disambiguator = getDisambiguator(move, moves);
                output += move.piece.toUpperCase() + disambiguator;
            }
            if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                if (move.piece === PAWN) {
                    output += algebraic(move.from)[0];
                }
                output += 'x';
            }
            output += algebraic(move.to);
            if (move.promotion) {
                output += '=' + move.promotion.toUpperCase();
            }
        }
        this._makeMove(move);
        if (this.isCheck()) {
            if (this.isCheckmate()) {
                output += '#';
            }
            else {
                output += '+';
            }
        }
        this._undoMove();
        return output;
    }
    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    _moveFromSan(move, strict = false) {
        // strip off any move decorations: e.g Nf3+?! becomes Nf3
        const cleanMove = strippedSan(move);
        let pieceType = inferPieceType(cleanMove);
        let moves = this._moves({ legal: true, piece: pieceType });
        // strict parser
        for (let i = 0, len = moves.length; i < len; i++) {
            if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
                return moves[i];
            }
        }
        // the strict parser failed
        if (strict) {
            return null;
        }
        let piece = undefined;
        let matches = undefined;
        let from = undefined;
        let to = undefined;
        let promotion = undefined;
        /*
         * The default permissive (non-strict) parser allows the user to parse
         * non-standard chess notations. This parser is only run after the strict
         * Standard Algebraic Notation (SAN) parser has failed.
         *
         * When running the permissive parser, we'll run a regex to grab the piece, the
         * to/from square, and an optional promotion piece. This regex will
         * parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7,
         * f7f8q, b1c3
         *
         * NOTE: Some positions and moves may be ambiguous when using the permissive
         * parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
         * the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated bishop
         * move). In these cases, the permissive parser will default to the most
         * basic interpretation (which is b1c3 parsing to Nc3).
         */
        let overlyDisambiguated = false;
        matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
        if (matches) {
            piece = matches[1];
            from = matches[2];
            to = matches[3];
            promotion = matches[4];
            if (from.length == 1) {
                overlyDisambiguated = true;
            }
        }
        else {
            /*
             * The [a-h]?[1-8]? portion of the regex below handles moves that may be
             * overly disambiguated (e.g. Nge7 is unnecessary and non-standard when
             * there is one legal knight move to e7). In this case, the value of
             * 'from' variable will be a rank or file, not a square.
             */
            matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/);
            if (matches) {
                piece = matches[1];
                from = matches[2];
                to = matches[3];
                promotion = matches[4];
                if (from.length == 1) {
                    overlyDisambiguated = true;
                }
            }
        }
        pieceType = inferPieceType(cleanMove);
        moves = this._moves({
            legal: true,
            piece: piece ? piece : pieceType,
        });
        if (!to) {
            return null;
        }
        for (let i = 0, len = moves.length; i < len; i++) {
            if (!from) {
                // if there is no from square, it could be just 'x' missing from a capture
                if (cleanMove ===
                    strippedSan(this._moveToSan(moves[i], moves)).replace('x', '')) {
                    return moves[i];
                }
                // hand-compare move properties with the results from our permissive regex
            }
            else if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                Ox88[from] == moves[i].from &&
                Ox88[to] == moves[i].to &&
                (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                return moves[i];
            }
            else if (overlyDisambiguated) {
                /*
                 * SPECIAL CASE: we parsed a move string that may have an unneeded
                 * rank/file disambiguator (e.g. Nge7).  The 'from' variable will
                 */
                const square = algebraic(moves[i].from);
                if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                    Ox88[to] == moves[i].to &&
                    (from == square[0] || from == square[1]) &&
                    (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                    return moves[i];
                }
            }
        }
        return null;
    }
    ascii() {
        let s = '   +------------------------+\n';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // display the rank
            if (file(i) === 0) {
                s += ' ' + '87654321'[rank(i)] + ' |';
            }
            if (this._board[i]) {
                const piece = this._board[i].type;
                const color = this._board[i].color;
                const symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
                s += ' ' + symbol + ' ';
            }
            else {
                s += ' . ';
            }
            if ((i + 1) & 0x88) {
                s += '|\n';
                i += 8;
            }
        }
        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h';
        return s;
    }
    perft(depth) {
        const moves = this._moves({ legal: false });
        let nodes = 0;
        const color = this._turn;
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(color)) {
                if (depth - 1 > 0) {
                    nodes += this.perft(depth - 1);
                }
                else {
                    nodes++;
                }
            }
            this._undoMove();
        }
        return nodes;
    }
    // pretty = external move object
    _makePretty(uglyMove) {
        const { color, piece, from, to, flags, captured, promotion } = uglyMove;
        let prettyFlags = '';
        for (const flag in BITS) {
            if (BITS[flag] & flags) {
                prettyFlags += FLAGS[flag];
            }
        }
        const fromAlgebraic = algebraic(from);
        const toAlgebraic = algebraic(to);
        const move = {
            color,
            piece,
            from: fromAlgebraic,
            to: toAlgebraic,
            san: this._moveToSan(uglyMove, this._moves({ legal: true })),
            flags: prettyFlags,
            lan: fromAlgebraic + toAlgebraic,
            before: this.fen(),
            after: '',
        };
        // generate the FEN for the 'after' key
        this._makeMove(uglyMove);
        move.after = this.fen();
        this._undoMove();
        if (captured) {
            move.captured = captured;
        }
        if (promotion) {
            move.promotion = promotion;
            move.lan += promotion;
        }
        return move;
    }
    turn() {
        return this._turn;
    }
    board() {
        const output = [];
        let row = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i] == null) {
                row.push(null);
            }
            else {
                row.push({
                    square: algebraic(i),
                    type: this._board[i].type,
                    color: this._board[i].color,
                });
            }
            if ((i + 1) & 0x88) {
                output.push(row);
                row = [];
                i += 8;
            }
        }
        return output;
    }
    squareColor(square) {
        if (square in Ox88) {
            const sq = Ox88[square];
            return (rank(sq) + file(sq)) % 2 === 0 ? 'light' : 'dark';
        }
        return null;
    }
    history({ verbose = false } = {}) {
        const reversedHistory = [];
        const moveHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            if (verbose) {
                moveHistory.push(this._makePretty(move));
            }
            else {
                moveHistory.push(this._moveToSan(move, this._moves()));
            }
            this._makeMove(move);
        }
        return moveHistory;
    }
    _pruneComments() {
        const reversedHistory = [];
        const currentComments = {};
        const copyComment = (fen) => {
            if (fen in this._comments) {
                currentComments[fen] = this._comments[fen];
            }
        };
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        copyComment(this.fen());
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            this._makeMove(move);
            copyComment(this.fen());
        }
        this._comments = currentComments;
    }
    getComment() {
        return this._comments[this.fen()];
    }
    setComment(comment) {
        this._comments[this.fen()] = comment.replace('{', '[').replace('}', ']');
    }
    deleteComment() {
        const comment = this._comments[this.fen()];
        delete this._comments[this.fen()];
        return comment;
    }
    getComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            return { fen: fen, comment: this._comments[fen] };
        });
    }
    deleteComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            const comment = this._comments[fen];
            delete this._comments[fen];
            return { fen: fen, comment: comment };
        });
    }
    setCastlingRights(color, rights) {
        for (const side of [KING, QUEEN]) {
            if (rights[side] !== undefined) {
                if (rights[side]) {
                    this._castling[color] |= SIDES[side];
                }
                else {
                    this._castling[color] &= ~SIDES[side];
                }
            }
        }
        this._updateCastlingRights();
        const result = this.getCastlingRights(color);
        return ((rights[KING] === undefined || rights[KING] === result[KING]) &&
            (rights[QUEEN] === undefined || rights[QUEEN] === result[QUEEN]));
    }
    getCastlingRights(color) {
        return {
            [KING]: (this._castling[color] & SIDES[KING]) !== 0,
            [QUEEN]: (this._castling[color] & SIDES[QUEEN]) !== 0,
        };
    }
    moveNumber() {
        return this._moveNumber;
    }
}
//# sourceMappingURL=chess.js.map

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/v2/gameBrowser/gameBrowser.css":
/*!*********************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/v2/gameBrowser/gameBrowser.css ***!
  \*********************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.player{
    column-count:2;
    height:4vh;
}
.player.above{
    padding-top:4px;
    margin-bottom: -3px;
}
.player.below{
    margin-top:-1px;
}
.player.below .captures{
    margin-top:-6px;
}
.player .name{
    clear:both;
    text-align: right;
    padding-right:4px;
    line-height:3vh;
}
.player .captures{
    float:left;
    margin-top:-5px;
}
.player .score{
    float:left;
    margin-left:5px;
    margin-top:2px;
    font-size:10pt;
}
.player .captures svg{
    position:static;
    height:4vh;
    width:4vh;
    transform:none;
    margin-top:0;
    margin-bottom:-11px;
}
.player.white .captures span{
    padding-bottom: 7px;
}
.player .captures .p svg:first-child{
    padding-left:4px;
}
.player .captures .p svg{
    margin-left:-8px;
    margin-right:-5px;
}
.player .captures .n{
    margin-left: 2px;
    margin-right: 1px;
}
.player .captures .n svg{
    margin-left: -6px;
    margin-right: -3px;
}
.player .captures .b svg{
    margin-left: -7px;
    margin-right: -4px;
}
.player .captures .r svg{
    margin-left: -6px;
    margin-right: -5px;
}
.player .captures .q svg{
    margin-bottom:-10px;
    margin-left: -2px;
    margin-right: 0px;
}`, "",{"version":3,"sources":["webpack://./src/components/v2/gameBrowser/gameBrowser.css"],"names":[],"mappings":"AAAA;IACI,cAAc;IACd,UAAU;AACd;AACA;IACI,eAAe;IACf,mBAAmB;AACvB;AACA;IACI,eAAe;AACnB;AACA;IACI,eAAe;AACnB;AACA;IACI,UAAU;IACV,iBAAiB;IACjB,iBAAiB;IACjB,eAAe;AACnB;AACA;IACI,UAAU;IACV,eAAe;AACnB;AACA;IACI,UAAU;IACV,eAAe;IACf,cAAc;IACd,cAAc;AAClB;AACA;IACI,eAAe;IACf,UAAU;IACV,SAAS;IACT,cAAc;IACd,YAAY;IACZ,mBAAmB;AACvB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,gBAAgB;AACpB;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,mBAAmB;IACnB,iBAAiB;IACjB,iBAAiB;AACrB","sourcesContent":[".player{\r\n    column-count:2;\r\n    height:4vh;\r\n}\r\n.player.above{\r\n    padding-top:4px;\r\n    margin-bottom: -3px;\r\n}\r\n.player.below{\r\n    margin-top:-1px;\r\n}\r\n.player.below .captures{\r\n    margin-top:-6px;\r\n}\r\n.player .name{\r\n    clear:both;\r\n    text-align: right;\r\n    padding-right:4px;\r\n    line-height:3vh;\r\n}\r\n.player .captures{\r\n    float:left;\r\n    margin-top:-5px;\r\n}\r\n.player .score{\r\n    float:left;\r\n    margin-left:5px;\r\n    margin-top:2px;\r\n    font-size:10pt;\r\n}\r\n.player .captures svg{\r\n    position:static;\r\n    height:4vh;\r\n    width:4vh;\r\n    transform:none;\r\n    margin-top:0;\r\n    margin-bottom:-11px;\r\n}\r\n.player.white .captures span{\r\n    padding-bottom: 7px;\r\n}\r\n.player .captures .p svg:first-child{\r\n    padding-left:4px;\r\n}\r\n.player .captures .p svg{\r\n    margin-left:-8px;\r\n    margin-right:-5px;\r\n}\r\n.player .captures .n{\r\n    margin-left: 2px;\r\n    margin-right: 1px;\r\n}\r\n.player .captures .n svg{\r\n    margin-left: -6px;\r\n    margin-right: -3px;\r\n}\r\n.player .captures .b svg{\r\n    margin-left: -7px;\r\n    margin-right: -4px;\r\n}\r\n.player .captures .r svg{\r\n    margin-left: -6px;\r\n    margin-right: -5px;\r\n}\r\n.player .captures .q svg{\r\n    margin-bottom:-10px;\r\n    margin-left: -2px;\r\n    margin-right: 0px;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/pages/openings/openings.css":
/*!*******************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/pages/openings/openings.css ***!
  \*******************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body{padding:0;margin:0;}`, "",{"version":3,"sources":["webpack://./src/pages/openings/openings.css"],"names":[],"mappings":"AAAA,KAAK,SAAS,CAAC,QAAQ,CAAC","sourcesContent":["body{padding:0;margin:0;}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/components/v2/gameBrowser/gameBrowser.css":
/*!*******************************************************!*\
  !*** ./src/components/v2/gameBrowser/gameBrowser.css ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_gameBrowser_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./gameBrowser.css */ "./node_modules/css-loader/dist/cjs.js!./src/components/v2/gameBrowser/gameBrowser.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_gameBrowser_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_gameBrowser_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_gameBrowser_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_gameBrowser_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/pages/openings/openings.css":
/*!*****************************************!*\
  !*** ./src/pages/openings/openings.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./openings.css */ "./node_modules/css-loader/dist/cjs.js!./src/pages/openings/openings.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/components/v2/chessboard/Chessboard.ts":
/*!****************************************************!*\
  !*** ./src/components/v2/chessboard/Chessboard.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BoardLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/BoardLayer */ "./src/components/v2/chessboard/Layers/BoardLayer.ts"));
const CordsLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/CordsLayer */ "./src/components/v2/chessboard/Layers/CordsLayer.ts"));
const PieceLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/PieceLayer */ "./src/components/v2/chessboard/Layers/PieceLayer.ts"));
const ArrowLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/ArrowLayer */ "./src/components/v2/chessboard/Layers/ArrowLayer.ts"));
const MouseEvents_1 = __importDefault(__webpack_require__(/*! ./MouseEvents */ "./src/components/v2/chessboard/MouseEvents.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ./Shared */ "./src/components/v2/chessboard/Shared.ts"));
class Chessboard {
    constructor(boardContainer, fen, isRotated) {
        this.isRotated = false;
        this.isRotated = isRotated;
        this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgRoot.setAttribute('viewBox', '0 0 800 800');
        boardContainer.appendChild(this.svgRoot);
        this.boardLayer = new BoardLayer_1.default(this.svgRoot, isRotated);
        this.cordsLayer = new CordsLayer_1.default(this.svgRoot, isRotated);
        this.pieceLayer = new PieceLayer_1.default(this.svgRoot, isRotated);
        this.arrowLayer = new ArrowLayer_1.default(this.svgRoot, isRotated);
        this.mouseEvents = new MouseEvents_1.default(this.svgRoot, this.boardLayer, this.arrowLayer, this.isRotated);
        this.setFen(fen, false);
    }
    rotate() {
        this.isRotated = !this.isRotated;
        this.boardLayer.rotate(this.isRotated);
        this.cordsLayer.rotate(this.isRotated);
        this.pieceLayer.rotate(this.isRotated);
        this.arrowLayer.rotate(this.isRotated);
        this.mouseEvents.rotate(this.isRotated);
    }
    setFen(fen, clearFirst) {
        if (clearFirst) {
            this.pieceLayer.clear();
        }
        if (fen !== "") {
            if (fen.toLowerCase() === "start")
                fen = Shared_1.default.startFEN;
            fen = fen.split(" ")[0].split("/").join("");
            let squareIndex = 0;
            for (let i = 0; i < fen.length; i++) {
                let fenChar = fen[i];
                let nummericValue = parseInt(fenChar);
                if (!isNaN(nummericValue)) {
                    squareIndex += nummericValue;
                }
                else {
                    let rotatedIndex = this.isRotated ? 63 - squareIndex : squareIndex;
                    let key = Shared_1.default.getSquareKeyByIndex(rotatedIndex, this.isRotated);
                    this.pieceLayer.addPiece(fenChar, key);
                    squareIndex++;
                }
            }
        }
    }
    getPiece(squareKey) {
        return this.pieceLayer.getPiece(squareKey);
    }
    addPiece(fenChar, squareKey) {
        return this.pieceLayer.addPiece(fenChar, squareKey);
    }
    undoPieceRemoval(piece) {
        this.pieceLayer.undoPieceRemoval(piece);
    }
    putPieceBackWithNewPosition(piece, squareKey) {
        piece.squareKey = squareKey;
        this.pieceLayer.undoPieceRemoval(piece);
    }
    removePieceBySquareKey(squareKey) {
        return this.pieceLayer.removePieceBySquareKey(squareKey);
    }
    highlightSource(from) {
        this.boardLayer.highlightSource(from);
    }
    highlightTarget(to) {
        this.boardLayer.highlightTarget(to);
    }
    clearSourceAndTargetHighlights() {
        this.boardLayer.clearSourceAndTargetHighlights();
    }
    highlightSourceAndTarget(from, to) {
        this.boardLayer.highlightSourceAndTarget(from, to);
    }
}
exports["default"] = Chessboard;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/ArrowLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/ArrowLayer.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shared_1 = __importDefault(__webpack_require__(/*! ../Shared */ "./src/components/v2/chessboard/Shared.ts"));
class ArrowLayer {
    constructor(svgRoot, isRotated) {
        this.strokeWidth = 20;
        this.rightClickedSquareKey = null;
        this.isRotated = false;
        this.currentArrows = [];
        this.svgRoot = svgRoot;
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgRoot.appendChild(group);
        this.group = group;
        this.isRotated = isRotated;
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        this.group.innerHTML = "";
        this.currentArrows.forEach(arrow => {
            this.drawArrow(arrow.from, arrow.to);
        });
    }
    onRightButtonDown(squareKey) {
        this.rightClickedSquareKey = squareKey;
    }
    onLeftButtonDown() {
        this.group.innerHTML = "";
        this.currentArrows = [];
    }
    onRightButtonUp(squareKey) {
        if (this.rightClickedSquareKey && this.rightClickedSquareKey !== squareKey) {
            this.drawArrow(this.rightClickedSquareKey, squareKey);
        }
    }
    drawArrow(fromSquare, toSquare) {
        this.currentArrows.push({ from: fromSquare, to: toSquare });
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        let point1 = this.svgRoot.createSVGPoint();
        let point2 = this.svgRoot.createSVGPoint();
        let point3 = this.svgRoot.createSVGPoint();
        let point4 = this.svgRoot.createSVGPoint();
        let point5 = this.svgRoot.createSVGPoint();
        let point6 = this.svgRoot.createSVGPoint();
        let point7 = this.svgRoot.createSVGPoint();
        let from = this.getRelativeCenter(fromSquare);
        let to = this.getRelativeCenter(toSquare);
        let distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
        let shortenDistance = 30;
        let center = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
        let triangleSideLength = 40;
        let a = triangleSideLength / 2;
        let c = triangleSideLength;
        let heightOfTriangle = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
        point1.x = center.x - (distance / 2) + shortenDistance;
        point1.y = center.y - this.strokeWidth / 2;
        point2.x = point1.x;
        point2.y = point1.y + this.strokeWidth;
        point3.x = point2.x + distance - heightOfTriangle - shortenDistance;
        point3.y = point2.y;
        point4.x = point3.x;
        point4.y = point3.y + ((triangleSideLength / 2) - (this.strokeWidth / 2));
        point5.x = point4.x + heightOfTriangle;
        point5.y = center.y;
        point6.x = point4.x;
        point6.y = point4.y - triangleSideLength;
        point7.x = point3.x;
        point7.y = point3.y - this.strokeWidth;
        let deltaX = to.x - from.x;
        let deltaY = to.y - from.y;
        let radian = Math.atan2(deltaY, deltaX);
        let degrees = radian * 180 / Math.PI;
        polygon.setAttribute('transform', "rotate(" + degrees + " " + center.x.toString() + " " + center.y.toString() + ")");
        polygon.setAttribute("class", "arrow");
        polygon.setAttribute("fill", "rgba(255, 170, 0, 0.8)");
        polygon.points.appendItem(point1);
        polygon.points.appendItem(point2);
        polygon.points.appendItem(point3);
        polygon.points.appendItem(point4);
        polygon.points.appendItem(point5);
        polygon.points.appendItem(point6);
        polygon.points.appendItem(point7);
        this.group.appendChild(polygon);
    }
    getRelativeCenter(squareKey) {
        let char = squareKey[0];
        let digit = squareKey[1];
        let x = Shared_1.default.getHorizontalIndex(char, this.isRotated) * 100 + 50;
        let y = Shared_1.default.getVerticalIndex(digit, this.isRotated) * 100 + 50;
        return { x, y };
    }
}
exports["default"] = ArrowLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/BoardLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/BoardLayer.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SquareFactory_1 = __importDefault(__webpack_require__(/*! ../SquareFactory */ "./src/components/v2/chessboard/SquareFactory.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ../Shared */ "./src/components/v2/chessboard/Shared.ts"));
class BoardLayer {
    constructor(svgRoot, isRotated) {
        this.sourceColor = "rgba(255, 255, 51, 0.3)";
        this.targetColor = "rgba(255, 255, 51, 0.4)";
        this.rightClickColor = "rgb(235, 97, 80, 0.8)";
        this.rightClicks = {};
        this.rightClickedSquareKey = null;
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgRoot.appendChild(group);
        let colors = ["l", "d", "l", "d", "l", "d", "l", "d"];
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(y => {
            [0, 1, 2, 3, 4, 5, 6, 7].forEach((x, index) => {
                group.appendChild(this.createBoardRect(x, y, colors[index]));
            });
            colors = colors.reverse();
        });
        this.sourceTargetGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgRoot.appendChild(this.sourceTargetGroup);
        this.sourceHighlight = { squareKey: "a8", type: "source", rect: SquareFactory_1.default.createRect(0, 0) };
        this.targetHighlight = { squareKey: "a7", type: "target", rect: SquareFactory_1.default.createRect(1, 0) };
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
        this.sourceTargetGroup.appendChild(this.sourceHighlight.rect);
        this.sourceTargetGroup.appendChild(this.targetHighlight.rect);
        this.rightClickGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgRoot.appendChild(this.rightClickGroup);
    }
    onLeftButtonDown() {
        this.clearAllHighlights();
    }
    onRightButtonDown(squareKey) {
        this.rightClickedSquareKey = squareKey;
    }
    onRightButtonUp(squareKey) {
        if (this.rightClickedSquareKey && this.rightClickedSquareKey === squareKey) {
            let rightClicked = this.rightClicks[squareKey];
            if (rightClicked) {
                this.rightClickGroup.removeChild(rightClicked.rect);
                this.rightClicks[squareKey] = null;
            }
            else {
                this.createRightClickHighlight(squareKey);
            }
        }
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        this.setPosition(this.sourceHighlight);
        this.setPosition(this.targetHighlight);
        Object.values(this.rightClicks).forEach(rightClick => {
            if (rightClick) {
                this.setPosition(rightClick);
            }
        });
    }
    highlightSourceAndTarget(from, to) {
        this.clearAllHighlights();
        this.highlightSource(from);
        this.highlightTarget(to);
    }
    highlightSource(from) {
        this.sourceHighlight.squareKey = from;
        this.sourceHighlight.rect.setAttribute("fill", this.sourceColor);
        this.setPosition(this.sourceHighlight);
    }
    highlightTarget(to) {
        this.targetHighlight.squareKey = to;
        this.targetHighlight.rect.setAttribute("fill", this.targetColor);
        this.setPosition(this.targetHighlight);
    }
    clearSourceAndTargetHighlights() {
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
    }
    showTargetOrSource(squareKey, highlight, color) {
        highlight.squareKey = squareKey;
        highlight.rect.setAttribute("fill", color);
        this.setPosition(highlight);
    }
    clearAllHighlights() {
        this.clearSourceAndTargetHighlights();
        this.rightClicks = {};
        this.rightClickGroup.innerHTML = "";
    }
    createRightClickHighlight(squareKey) {
        let cords = Shared_1.default.getCordinatesBySquareKey(squareKey, this.isRotated);
        let rect = SquareFactory_1.default.createRect(cords.x, cords.y);
        rect.setAttribute("fill", this.rightClickColor);
        this.rightClickGroup.appendChild(rect);
        this.rightClicks[squareKey] = { squareKey, type: "RightClick", rect };
    }
    setPosition(highlight) {
        let cord = Shared_1.default.getCordinatesBySquareKey(highlight.squareKey, this.isRotated);
        highlight.rect.setAttribute("x", (cord.x * 100).toString());
        highlight.rect.setAttribute("y", (cord.y * 100).toString());
    }
    createBoardRect(x, y, color) {
        let rect = SquareFactory_1.default.createRect(x, y);
        rect.setAttribute("fill", color === "l" ? "rgb(233,237,204)" : "rgb(119,153,84)");
        return rect;
    }
}
exports["default"] = BoardLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/CordsLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/CordsLayer.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CordsLayer {
    constructor(svgRoot, isRotated) {
        this.isRotated = isRotated;
        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.setAttribute("font-family", "Helvetica");
        this.group.setAttribute("font-weight", "bold");
        this.group.setAttribute("fill", "rgb(30,30,30");
        svgRoot.append(this.group);
        this.horizontalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.verticalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.appendChild(this.horizontalGroup);
        this.group.appendChild(this.verticalGroup);
        this.horizontalGroup.setAttribute("transform", "translate(86, 795.5)");
        this.verticalGroup.setAttribute("transform", "translate(5, 18)");
        this.getHorizontalCords(isRotated).forEach((letter, index) => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", "translate(" + (index * 100).toString() + ",0)");
            this.horizontalGroup.appendChild(group);
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("transform", "scale(0.9)");
            text.textContent = letter;
            group.appendChild(text);
        });
        this.getVerticalCords(isRotated).forEach((number, index) => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", "translate(0," + +(index * 100).toString() + ")");
            this.verticalGroup.appendChild(group);
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = number;
            text.setAttribute("transform", "scale(1)");
            group.appendChild(text);
        });
    }
    getHorizontalCords(isRotated) {
        let horizontalCords = ["A", "B", "C", "D", "E", "F", "G", "H"];
        return isRotated ? horizontalCords.reverse() : horizontalCords;
    }
    getVerticalCords(isRotated) {
        let verticalCords = ["8", "7", "6", "5", "4", "3", "2", "1"];
        return isRotated ? verticalCords.reverse() : verticalCords;
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        let letters = this.getHorizontalCords(isRotated);
        let numbers = this.getVerticalCords(isRotated);
        Array.from(this.horizontalGroup.children).forEach((child, index) => {
            child.children[0].textContent = letters[index];
        });
        Array.from(this.verticalGroup.children).forEach((child, index) => {
            child.children[0].textContent = numbers[index];
        });
    }
}
exports["default"] = CordsLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/PieceLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/PieceLayer.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PieceFactory_1 = __importDefault(__webpack_require__(/*! ../PieceFactory */ "./src/components/v2/chessboard/PieceFactory.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ../Shared */ "./src/components/v2/chessboard/Shared.ts"));
class PieceLayer {
    constructor(svgRoot, isRotated) {
        this.positions = {};
        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgRoot.appendChild(this.group);
        this.isRotated = isRotated;
    }
    clear() {
        this.positions = {};
        this.group.innerHTML = "";
    }
    getPiece(squareKey) {
        return this.positions[squareKey];
    }
    addPiece(fenChar, squareKey) {
        let piece = PieceFactory_1.default.get(fenChar, squareKey);
        this.group.appendChild(piece.element);
        this.setPosition(piece);
        return piece;
    }
    undoPieceRemoval(piece) {
        this.group.appendChild(piece.element);
        this.setPosition(piece);
    }
    removePieceBySquareKey(squareKey) {
        let piece = this.positions[squareKey];
        this.group.removeChild(piece.element);
        this.positions[squareKey] = undefined;
        return piece;
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        let pieces = Object.values(this.positions);
        this.positions = {};
        pieces.forEach(piece => {
            if (piece) {
                this.setPosition(piece);
            }
        });
    }
    setPosition(piece) {
        let squareKey = piece.squareKey;
        this.positions[squareKey] = piece;
        Shared_1.default.setPosition(piece.element, squareKey, this.isRotated);
    }
}
exports["default"] = PieceLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/MouseEvents.ts":
/*!*****************************************************!*\
  !*** ./src/components/v2/chessboard/MouseEvents.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shared_1 = __importDefault(__webpack_require__(/*! ./Shared */ "./src/components/v2/chessboard/Shared.ts"));
class MouseEvents {
    constructor(svgRoot, boardLayer, arrowLayer, isRotated) {
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;
        this.svgRoot.addEventListener("mousedown", (event) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick) {
                let squareKey = Shared_1.default.getSquareByCursorPosition(this.svgRoot, event, this.isRotated);
                boardLayer.onRightButtonDown(squareKey);
                arrowLayer.onRightButtonDown(squareKey);
            }
            else {
                boardLayer.onLeftButtonDown();
                arrowLayer.onLeftButtonDown();
            }
            event.preventDefault();
        });
        this.svgRoot.addEventListener("mouseup", (event) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick) {
                let squareKey = Shared_1.default.getSquareByCursorPosition(this.svgRoot, event, this.isRotated);
                boardLayer.onRightButtonUp(squareKey);
                arrowLayer.onRightButtonUp(squareKey);
                event.preventDefault();
            }
        });
        this.svgRoot.addEventListener("contextmenu", (event) => event.preventDefault());
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
    }
}
exports["default"] = MouseEvents;


/***/ }),

/***/ "./src/components/v2/chessboard/PieceElementFactory.ts":
/*!*************************************************************!*\
  !*** ./src/components/v2/chessboard/PieceElementFactory.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const bishop = __importStar(__webpack_require__(/*! ./assets/pieces/b.json */ "./src/components/v2/chessboard/assets/pieces/b.json"));
const king = __importStar(__webpack_require__(/*! ./assets/pieces/k.json */ "./src/components/v2/chessboard/assets/pieces/k.json"));
const knight = __importStar(__webpack_require__(/*! ./assets/pieces/n.json */ "./src/components/v2/chessboard/assets/pieces/n.json"));
const pawn = __importStar(__webpack_require__(/*! ./assets/pieces/p.json */ "./src/components/v2/chessboard/assets/pieces/p.json"));
const queen = __importStar(__webpack_require__(/*! ./assets/pieces/q.json */ "./src/components/v2/chessboard/assets/pieces/q.json"));
const rook = __importStar(__webpack_require__(/*! ./assets/pieces/r.json */ "./src/components/v2/chessboard/assets/pieces/r.json"));
const pieceSVGData = {};
pieceSVGData["p"] = pawn.g;
pieceSVGData["r"] = rook.g;
pieceSVGData["n"] = knight.g;
pieceSVGData["b"] = bishop.g;
pieceSVGData["q"] = queen.g;
pieceSVGData["k"] = king.g;
const pieceElementTypes = {};
["p", "n", "b", "r", "q", "k", "P", "N", "B", "R", "Q", "K"].forEach(fenChar => {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let data = pieceSVGData[fenChar.toLowerCase()];
    let color = fenChar === fenChar.toLowerCase() ? 0 : 1;
    loadChildren(g, data, color);
    pieceElementTypes[fenChar] = g;
});
function loadChildren(g, group, color) {
    if (group.transform) {
        g.setAttribute("transform", group.transform);
    }
    if (group.style && group.style[color]) {
        g.setAttribute("style", group.style[color]);
    }
    if (group.circle) {
        group.circle.forEach(circle => {
            let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute("cx", circle.cx);
            c.setAttribute("cy", circle.cy);
            c.setAttribute("r", circle.r);
            g.appendChild(c);
        });
    }
    if (group.path) {
        group.path.forEach(path => {
            let p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (path.colorIndex === undefined || path.colorIndex === color) {
                p.setAttribute("d", path.d);
                if (path.style) {
                    p.setAttribute("style", path.style[color]);
                }
                g.appendChild(p);
            }
        });
    }
    if (group.g) {
        let childGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.appendChild(childGroup);
        loadChildren(childGroup, group.g, color);
    }
}
var PieceElementFactory;
(function (PieceElementFactory) {
    function get(fenChar) {
        return pieceElementTypes[fenChar].cloneNode(true);
    }
    PieceElementFactory.get = get;
})(PieceElementFactory || (PieceElementFactory = {}));
exports["default"] = PieceElementFactory;


/***/ }),

/***/ "./src/components/v2/chessboard/PieceFactory.ts":
/*!******************************************************!*\
  !*** ./src/components/v2/chessboard/PieceFactory.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PieceElementFactory_1 = __importDefault(__webpack_require__(/*! ./PieceElementFactory */ "./src/components/v2/chessboard/PieceElementFactory.ts"));
var PieceFactory;
(function (PieceFactory) {
    function get(fenChar, squareKey) {
        let element = PieceElementFactory_1.default.get(fenChar);
        return { fenChar, element, squareKey };
    }
    PieceFactory.get = get;
})(PieceFactory || (PieceFactory = {}));
exports["default"] = PieceFactory;


/***/ }),

/***/ "./src/components/v2/chessboard/Shared.ts":
/*!************************************************!*\
  !*** ./src/components/v2/chessboard/Shared.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Shared;
(function (Shared) {
    const squareKeys = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"];
    const horizontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const vertical = ["8", "7", "6", "5", "4", "3", "2", "1"];
    Shared.startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    function getSquareKeyByIndexes(horizontalIndex, verticalIndex, isRotated) {
        let letterIndex = isRotated ? 7 - horizontalIndex : horizontalIndex;
        let digitIndex = isRotated ? 7 - verticalIndex : verticalIndex;
        return horizontal[letterIndex] + vertical[digitIndex];
    }
    Shared.getSquareKeyByIndexes = getSquareKeyByIndexes;
    function getSquareKeyByIndex(index, isRotated) {
        let i = isRotated ? 63 - index : index;
        return squareKeys[i];
    }
    Shared.getSquareKeyByIndex = getSquareKeyByIndex;
    function getCurrentIndexOfSquareKey(squareKey, isRotated) {
        let index = squareKeys.indexOf(squareKey);
        return isRotated ? 63 - index : index;
    }
    Shared.getCurrentIndexOfSquareKey = getCurrentIndexOfSquareKey;
    function getHorizontalIndex(squareLetter, isRotated) {
        let index = horizontal.indexOf(squareLetter);
        return isRotated ? 7 - index : index;
    }
    Shared.getHorizontalIndex = getHorizontalIndex;
    function getVerticalIndex(squareNumber, isRotated) {
        let index = vertical.indexOf(squareNumber);
        return isRotated ? 7 - index : index;
    }
    Shared.getVerticalIndex = getVerticalIndex;
    function getCordinatesBySquareKey(squareKey, isRotated) {
        let x = getHorizontalIndex(squareKey[0], isRotated);
        let y = getVerticalIndex(squareKey[1], isRotated);
        return { x, y };
    }
    Shared.getCordinatesBySquareKey = getCordinatesBySquareKey;
    function setPosition(element, squareKey, isRotated) {
        let cords = getCordinatesBySquareKey(squareKey, isRotated);
        element.setAttribute("transform", "translate(" + cords.x * 100 + "," + cords.y * 100 + ")");
    }
    Shared.setPosition = setPosition;
    function getSquareByCursorPosition(boardSVG, event, isRotated) {
        let svgParent = boardSVG.parentElement;
        let boardWidthAndHeight = svgParent.clientWidth;
        let squareWidthAndHeight = boardWidthAndHeight / 8;
        let boardCoordinateX = event.clientX - svgParent.offsetLeft + document.documentElement.scrollLeft;
        let boardCoordinateY = event.clientY - svgParent.offsetTop + document.documentElement.scrollTop;
        let squareIndexX = Math.floor(boardCoordinateX / squareWidthAndHeight);
        let squareIndexY = Math.floor(boardCoordinateY / squareWidthAndHeight);
        return getSquareKeyByIndexes(squareIndexX, squareIndexY, isRotated);
    }
    Shared.getSquareByCursorPosition = getSquareByCursorPosition;
})(Shared || (Shared = {}));
exports["default"] = Shared;


/***/ }),

/***/ "./src/components/v2/chessboard/SquareFactory.ts":
/*!*******************************************************!*\
  !*** ./src/components/v2/chessboard/SquareFactory.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var SVGSquare;
(function (SVGSquare) {
    function createRect(x, y) {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", (x * 100).toString());
        rect.setAttribute("y", (y * 100).toString());
        rect.setAttribute("width", "100");
        rect.setAttribute("height", "100");
        return rect;
    }
    SVGSquare.createRect = createRect;
})(SVGSquare || (SVGSquare = {}));
exports["default"] = SVGSquare;


/***/ }),

/***/ "./src/components/v2/gameBrowser/CapturePieceFactory.ts":
/*!**************************************************************!*\
  !*** ./src/components/v2/gameBrowser/CapturePieceFactory.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CapturePieceFactory = void 0;
const PieceElementFactory_1 = __importDefault(__webpack_require__(/*! ../chessboard/PieceElementFactory */ "./src/components/v2/chessboard/PieceElementFactory.ts"));
const pieceTypes = {};
["p", "n", "b", "r", "q", "P", "N", "B", "R", "Q"].forEach(fenChar => {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('viewBox', '0 0 100 100');
    let piece = PieceElementFactory_1.default.get(fenChar);
    svg.appendChild(piece);
    pieceTypes[fenChar] = svg;
});
var CapturePieceFactory;
(function (CapturePieceFactory) {
    function get(fenChar) {
        return pieceTypes[fenChar].cloneNode(true);
    }
    CapturePieceFactory.get = get;
})(CapturePieceFactory || (exports.CapturePieceFactory = CapturePieceFactory = {}));


/***/ }),

/***/ "./src/components/v2/gameBrowser/GameBrowser.ts":
/*!******************************************************!*\
  !*** ./src/components/v2/gameBrowser/GameBrowser.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Chessboard_1 = __importDefault(__webpack_require__(/*! ../chessboard/Chessboard */ "./src/components/v2/chessboard/Chessboard.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ../chessboard/Shared */ "./src/components/v2/chessboard/Shared.ts"));
const PlayerInfo_1 = __importDefault(__webpack_require__(/*! ./PlayerInfo */ "./src/components/v2/gameBrowser/PlayerInfo.ts"));
__webpack_require__(/*! ./gameBrowser.css */ "./src/components/v2/gameBrowser/gameBrowser.css");
const TransitionLayer_1 = __importDefault(__webpack_require__(/*! ./TransitionLayer */ "./src/components/v2/gameBrowser/TransitionLayer.ts"));
const PieceFactory_1 = __importDefault(__webpack_require__(/*! ../chessboard/PieceFactory */ "./src/components/v2/chessboard/PieceFactory.ts"));
class GameBrowser {
    constructor(container, fen, isRotated) {
        this.moves = [];
        this.currentMoveIndex = 0;
        this.state = "start";
        this.shortDelayBetweenMoves = 200;
        this.longDelayBetweenMoves = 1000;
        this.shortTransitionDuration = "1000ms";
        this.longTransitionDuration = "2000ms";
        this.chessboard = new Chessboard_1.default(container, fen, isRotated);
        this.playerInfo = new PlayerInfo_1.default(container, fen, isRotated);
        this.transitionLayer = new TransitionLayer_1.default(this.chessboard.svgRoot, isRotated);
        this.isRotated = isRotated;
        // setTimeout(() => {
        //     this.goToMove(7);
        // }, 10);
    }
    rotate() {
        this.isRotated = !this.isRotated;
        this.chessboard.rotate();
        this.playerInfo.rotate(this.isRotated);
        if (this.transitionLayer.currentTransition) {
            this.transitionLayer.cancelTransition("rotate");
        }
        this.transitionLayer.rotate();
    }
    loadGame(game) {
        this.chessboard.setFen(Shared_1.default.startFEN, true);
        this.playerInfo.setPlayerNames(game.blackPlayer, game.whitePlayer);
        this.playerInfo.setScoreAndCaputereByFen(Shared_1.default.startFEN);
        this.moves = game.moves;
        this.currentMoveIndex = -1;
    }
    rewind() {
        this.state = "rewind";
        this.moveBack();
    }
    previous() {
        this.state = "pause";
        this.moveBack();
    }
    play() {
        this.state = "play";
        this.moveForward();
    }
    pause() {
        this.state = "pause";
    }
    next() {
        this.state = "pause";
        this.moveForward();
    }
    forward() {
        this.state = "forward";
        this.moveForward();
    }
    goToMove(index) {
        this.currentMoveIndex = index;
        if (index === -1) {
            this.state = "start";
            let move = this.moves[0];
            this.chessboard.setFen(move.before, true);
            this.chessboard.clearSourceAndTargetHighlights();
        }
        else {
            if (index === this.moves.length - 1) {
                this.state = "end";
            }
            else {
                this.state = "pause";
            }
            let move = this.moves[index];
            this.chessboard.setFen(move.after, true);
            this.playerInfo.setScoreAndCaputereByFen(move.after);
            this.chessboard.highlightSourceAndTarget(move.from, move.to);
        }
    }
    moveForward() {
        clearTimeout(this.timeoutId);
        if (this.transitionLayer.currentTransition) {
            this.transitionLayer.cancelTransition("moveForward");
        }
        else if (this.currentMoveIndex < this.moves.length - 1) {
            let move = this.moves[this.currentMoveIndex + 1];
            let piece = this.chessboard.removePieceBySquareKey(move.from);
            this.chessboard.highlightSource(move.from);
            let castling = this.getCastling(move, true);
            if (castling) {
                this.chessboard.highlightTarget(castling.from);
            }
            let transitionInfo = {
                cancelReason: undefined,
                direction: "forward",
                piece,
                from: move.from,
                to: move.to,
                castling
            };
            let duration = this.state === "play" ? this.longTransitionDuration : this.shortTransitionDuration;
            this.transitionLayer.move(transitionInfo, duration, () => {
                //OnTransitionEnd
                this.finishMoveForward(transitionInfo, move, false);
            }, () => {
                //OnTransitionCancel
                if (transitionInfo.cancelReason === "moveForward" || transitionInfo.cancelReason === "rotate") {
                    this.finishMoveForward(transitionInfo, move, true);
                }
                else {
                    this.chessboard.undoPieceRemoval(transitionInfo.piece);
                    if (transitionInfo.castling) {
                        this.chessboard.undoPieceRemoval(transitionInfo.castling.rook);
                    }
                    this.moveBack();
                }
            });
        }
    }
    finishMoveForward(info, move, jumpToNextMove) {
        if (info.castling) {
            this.chessboard.putPieceBackWithNewPosition(info.castling.rook, info.castling.to);
            this.chessboard.highlightSource(info.castling.to);
        }
        else if (move.captured) {
            let capturedPiece = this.chessboard.removePieceBySquareKey(move.to);
            this.playerInfo.addCapture(capturedPiece.fenChar);
        }
        if (move.promotion) {
            let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
            this.chessboard.addPiece(promotionFenChar, move.to);
        }
        else {
            this.chessboard.putPieceBackWithNewPosition(info.piece, info.to);
        }
        this.chessboard.highlightTarget(move.to);
        this.currentMoveIndex++;
        if (this.currentMoveIndex < this.moves.length - 1) {
            if (jumpToNextMove) {
                this.moveForward();
            }
            else if (this.state === "play" || this.state === "forward") {
                this.timeoutId = setTimeout(() => {
                    if (this.state === "play" || this.state === "forward") {
                        this.moveForward();
                    }
                }, this.state === "play" ? this.longDelayBetweenMoves : this.shortDelayBetweenMoves);
            }
        }
    }
    moveBack() {
        clearTimeout(this.timeoutId);
        if (this.transitionLayer.currentTransition) {
            this.transitionLayer.cancelTransition("moveBack");
        }
        else if (this.currentMoveIndex === -1) {
            this.chessboard.clearSourceAndTargetHighlights();
            this.state = "start";
        }
        else {
            let move = this.moves[this.currentMoveIndex];
            let piece = this.chessboard.removePieceBySquareKey(move.to);
            if (move.promotion) {
                let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                piece = PieceFactory_1.default.get(fenChar, move.to);
                Shared_1.default.setPosition(piece.element, move.to, this.isRotated);
            }
            if (move.captured) {
                let captureFenChar = move.color === "w" ? move.captured : move.captured.toUpperCase();
                this.playerInfo.removeCapture(captureFenChar);
                this.chessboard.putPieceBackWithNewPosition(piece, move.to);
            }
            this.chessboard.highlightTarget(move.to);
            let castling = this.getCastling(move, false);
            if (castling) {
                this.chessboard.highlightSource(castling.to);
            }
            let transitionInfo = {
                cancelReason: undefined,
                direction: "back",
                piece: piece,
                from: move.from,
                to: move.to,
                castling: castling
            };
            this.transitionLayer.move(transitionInfo, this.shortTransitionDuration, () => {
                //OnTransitionEnd
                this.finishMoveBack(transitionInfo, false);
            }, () => {
                //OnTransitionCancel
                // If cancelled by click back then finish moving back
                if (transitionInfo.cancelReason === "moveBack" || transitionInfo.cancelReason === "rotate") {
                    this.finishMoveBack(transitionInfo, true);
                }
                // If cancelled by click forward then redo capture and promotion
                else {
                    let piece = transitionInfo.piece;
                    if (move.promotion) {
                        let fenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                        piece = PieceFactory_1.default.get(fenChar, move.to);
                    }
                    if (move.captured) {
                        let capturePiece = this.chessboard.removePieceBySquareKey(move.to);
                        this.playerInfo.addCapture(capturePiece.fenChar);
                    }
                    this.chessboard.putPieceBackWithNewPosition(piece, move.to);
                    if (transitionInfo.castling) {
                        this.chessboard.putPieceBackWithNewPosition(transitionInfo.castling.rook, transitionInfo.to);
                    }
                    if (this.state === "play" || this.state === "forward") {
                        this.moveForward();
                    }
                }
            });
        }
    }
    finishMoveBack(info, jumpToNextMove) {
        this.chessboard.putPieceBackWithNewPosition(info.piece, info.from);
        this.chessboard.highlightSource(info.from);
        if (info.castling) {
            this.chessboard.putPieceBackWithNewPosition(info.castling.rook, info.castling.from);
            this.chessboard.highlightTarget(info.castling.from);
        }
        if (this.currentMoveIndex > -1) {
            this.currentMoveIndex--;
            if (jumpToNextMove) {
                this.moveBack();
            }
            else if (this.state === "rewind") {
                this.timeoutId = setTimeout(() => {
                    if (this.state === "rewind") {
                        this.moveBack();
                    }
                }, this.shortDelayBetweenMoves);
            }
        }
    }
    getCastling(move, isForward) {
        if (move.san[0] === "O") {
            let from = move.color === "w" ? (move.san === "O-O" ? "h1" : "a1") : (move.san === "O-O" ? "h8" : "a8");
            let to = move.color === "w" ? (move.san === "O-O" ? "f1" : "d1") : (move.san === "O-O" ? "f8" : "d8");
            let rook = this.chessboard.removePieceBySquareKey(isForward ? from : to);
            return { rook, from, to };
        }
        return undefined;
    }
}
exports["default"] = GameBrowser;


/***/ }),

/***/ "./src/components/v2/gameBrowser/PlayerInfo.ts":
/*!*****************************************************!*\
  !*** ./src/components/v2/gameBrowser/PlayerInfo.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const CapturePieceFactory_1 = __webpack_require__(/*! ./CapturePieceFactory */ "./src/components/v2/gameBrowser/CapturePieceFactory.ts");
const pieceValues = { ["p"]: 1, ["n"]: 3, ["b"]: 3, ["r"]: 5, ["q"]: 9, ["P"]: -1, ["N"]: -3, ["B"]: -3, ["R"]: -5, ["Q"]: -9 };
class PlayerInfo {
    constructor(container, fen, isRotated) {
        this.whiteCaptures = {};
        this.blackCaptures = {};
        this.score = 0;
        this.container = container;
        this.blackPlayer = this.addChild(this.container, "div", "player black " + (isRotated ? "below" : "above"));
        this.whitePlayer = this.addChild(this.container, "div", "player white " + (isRotated ? "above" : "below"));
        let playerAboveBoard = isRotated ? this.whitePlayer : this.blackPlayer;
        this.container.insertBefore(playerAboveBoard, this.container.firstChild);
        let blackCapture = this.addChild(this.blackPlayer, "div", "captures");
        let whiteCapture = this.addChild(this.whitePlayer, "div", "captures");
        let record = [this.whiteCaptures, this.blackCaptures];
        [whiteCapture, blackCapture].forEach((element, index) => {
            ["p", "n", "b", "r", "q"].forEach(type => {
                let child = this.addChild(element, "span", type);
                record[index][type] = child;
            });
        });
        this.whiteScore = this.addChild(this.whitePlayer, "span", "score");
        this.blackScore = this.addChild(this.blackPlayer, "span", "score");
        this.whitePlayerName = this.addChild(this.whitePlayer, "div", "name", "White");
        this.blackPlayerName = this.addChild(this.blackPlayer, "div", "name", "Black");
        if (fen) {
            this.setScoreAndCaputereByFen(fen);
        }
    }
    rotate(isRotated) {
        let playerAboveBoard = isRotated ? this.whitePlayer : this.blackPlayer;
        let playerBelowBoard = isRotated ? this.blackPlayer : this.whitePlayer;
        this.container.insertBefore(playerAboveBoard, this.container.firstChild);
        this.container.appendChild(playerBelowBoard);
        playerAboveBoard.classList.remove("below");
        playerBelowBoard.classList.remove("above");
        playerAboveBoard.classList.add("above");
        playerBelowBoard.classList.add("below");
    }
    setScore(score) {
        this.score = score;
        let whitePrefix = score === 0 ? "" : (score > 0 ? "+" : "-");
        let blackPrefix = score === 0 ? "" : (score > 0 ? "-" : "+");
        this.whiteScore.innerHTML = score === 0 ? "" : (whitePrefix + Math.abs(score));
        this.blackScore.innerHTML = score === 0 ? "" : (blackPrefix + Math.abs(score));
    }
    setPlayerNames(black, white) {
        this.blackPlayerName.innerHTML = black;
        this.whitePlayerName.innerHTML = white;
    }
    setScoreAndCaputereByFen(fen) {
        Object.values(this.whiteCaptures).concat(Object.values(this.blackCaptures)).forEach(element => {
            element.innerHTML = "";
        });
        this.setScore(0);
        if (fen !== "start" && fen !== "") {
            let standing = this.calculateScoreAndCapturesByFen(fen);
            Object.entries(standing.captures).forEach(([fenChar, count]) => {
                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        this.addCapture(fenChar);
                    }
                }
            });
        }
    }
    addCapture(fenChar) {
        let piece = CapturePieceFactory_1.CapturePieceFactory.get(fenChar);
        let fenCharLowerCase = fenChar.toLowerCase();
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.appendChild(piece);
        let pieceValue = pieceValues[fenChar];
        let newScore = this.score + pieceValue;
        this.setScore(newScore);
    }
    removeCapture(fenChar) {
        let fenCharLowerCase = fenChar.toLowerCase();
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.removeChild(span.firstChild);
        let pieceValue = pieceValues[fenChar];
        let newScore = this.score - pieceValue;
        this.setScore(newScore);
    }
    calculateScoreAndCapturesByFen(fen) {
        // example: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        fen = fen.split(" ")[0].split("/").join("");
        // make a record of all types of pieces and set initial count to zero
        let fenChars = {};
        ["p", "n", "b", "r", "q", "P", "N", "B", "R", "Q"].forEach(char => {
            fenChars[char] = 0;
        });
        // calculate how many pieces we have of each kind
        for (const char of fen) {
            if (isNaN(parseInt(char))) {
                fenChars[char] += 1;
            }
        }
        ;
        // if the score is positive white is leading
        let score = fenChars["P"] - fenChars["p"];
        score += (fenChars["N"] + fenChars["B"] - fenChars["n"] - fenChars["b"]) * 3;
        score += (fenChars["R"] - fenChars["r"]) * 5;
        score += (fenChars["Q"] - fenChars["q"]) * 9;
        // we need to return a similar record showing how many pieces have been taken
        let captures = {};
        // we started having 2 rooks, knights and bishops. We could have more due to promotion
        for (const char of ["r", "n", "b", "R", "N", "B"]) {
            captures[char] = fenChars[char] >= 2 ? 0 : 2 - fenChars[char];
        }
        for (const char of ["q", "Q"]) {
            captures[char] = fenChars[char] > 0 ? 0 : 1;
        }
        // Counting taken pawns is difficult due to possible promotion
        let black = { pawn: "p", queen: "q", pieces: ["r", "n", "b"] };
        let white = { pawn: "P", queen: "Q", pieces: ["R", "N", "B"] };
        for (const player of [black, white]) {
            captures[player.pawn] = 8 - fenChars[player.pawn];
            if (fenChars[player.queen] > 1) {
                captures[player.pawn] -= fenChars[player.queen] - 1;
            }
            for (const piece of player.pieces) {
                if (fenChars[piece] > 2) {
                    captures[player.pawn] -= fenChars[piece] - 2;
                }
            }
        }
        return { score, captures };
    }
    addChild(parent, tag, className, text) {
        let child = document.createElement(tag);
        child.className = className;
        if (text)
            child.innerHTML = text;
        parent.appendChild(child);
        return child;
    }
}
exports["default"] = PlayerInfo;


/***/ }),

/***/ "./src/components/v2/gameBrowser/TransitionLayer.ts":
/*!**********************************************************!*\
  !*** ./src/components/v2/gameBrowser/TransitionLayer.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shared_1 = __importDefault(__webpack_require__(/*! ../chessboard/Shared */ "./src/components/v2/chessboard/Shared.ts"));
const PieceFactory_1 = __importDefault(__webpack_require__(/*! ../chessboard/PieceFactory */ "./src/components/v2/chessboard/PieceFactory.ts"));
class TransitionLayer {
    constructor(svgRoot, isRotated) {
        this.svgRoot = svgRoot;
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgRoot.appendChild(group);
        this.group = group;
        this.isRotated = isRotated;
        let transitionPieces = {};
        ["p", "r", "k", "b", "q", "k", "P", "R", "N", "B", "Q", "K"].forEach(fenChar => {
            let piece = PieceFactory_1.default.get(fenChar);
            transitionPieces[fenChar] = piece;
        });
    }
    rotate() {
        this.isRotated = !this.isRotated;
    }
    cancelTransition(reason) {
        if (this.currentTransition) {
            this.currentTransition.cancelReason = reason;
            let element = this.currentTransition.piece.element;
            element.style.transitionProperty = "";
            element.style.transitionDuration = "";
            element.style.transform = "";
            let castling = this.currentTransition.castling;
            if (castling) {
                let element = castling.rook.element;
                element.style.transitionProperty = "";
                element.style.transitionDuration = "";
                element.style.transform = "";
            }
        }
    }
    move(info, duration, onTransitionEnd, onTransitionCancel) {
        this.currentTransition = info;
        this.group.appendChild(info.piece.element);
        if (info.castling) {
            this.group.appendChild(info.castling.rook.element);
        }
        info.piece.element.ontransitionend = () => {
            this.removeTransition(info.piece.element);
            if (info.castling) {
                this.removeTransition(info.castling.rook.element);
            }
            this.currentTransition = undefined;
            onTransitionEnd();
        };
        info.piece.element.ontransitioncancel = () => {
            this.removeTransition(info.piece.element);
            if (info.castling) {
                this.removeTransition(info.castling.rook.element);
            }
            this.currentTransition = undefined;
            onTransitionCancel();
        };
        setTimeout(() => {
            this.startTransition(info.direction, duration, info.piece.element, info.from, info.to);
            if (info.castling) {
                this.startTransition(info.direction, duration, info.castling.rook.element, info.castling.from, info.castling.to);
            }
        }, 1);
    }
    startTransition(direction, duration, element, from, to) {
        element.style.transform = "";
        element.style.transitionProperty = "transform";
        element.style.transitionDuration = duration;
        let dest = direction === "forward" ? to : from;
        let cords = Shared_1.default.getCordinatesBySquareKey(dest, this.isRotated);
        element.style.transform = `translate(${cords.x * 12.5}%, ${cords.y * 12.5}%)`;
    }
    removeTransition(element) {
        element.style.transitionProperty = "";
        element.style.transitionDuration = "";
        element.style.transform = "";
        element.ontransitioncancel = null;
        element.ontransitionend = null;
        this.group.removeChild(element);
    }
}
exports["default"] = TransitionLayer;


/***/ }),

/***/ "./src/pages/openings/Openings.ts":
/*!****************************************!*\
  !*** ./src/pages/openings/Openings.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./openings.css */ "./src/pages/openings/openings.css");
const GameBrowser_1 = __importDefault(__webpack_require__(/*! ../../components/v2/gameBrowser/GameBrowser */ "./src/components/v2/gameBrowser/GameBrowser.ts"));
const chess_js_1 = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/dist/esm/chess.js");
// let boardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(boardContainer, "start", false);
// document.getElementById("test")!.onclick = () => chessboard.test();
// let f ="r7/3qp1k1/1p1p1pP1/p1nP1P2/PnP5/4B3/4B3/1Q3K2 w - - 1 28";
let fen = "8/kpPK4/8/8/8/8/8/8";
let browserContainer = document.getElementById("gameBrowser");
let gameBrowser = new GameBrowser_1.default(browserContainer, fen, false);
let chess = new chess_js_1.Chess();
// chess.loadPgn(json.games[0].moveText);
chess.loadPgn("1. e4 f5 2. exf5 g6 3. fxg6 d5 4. gxh7 Nc6 hxg8=Q");
let moves = chess.history({ verbose: true });
gameBrowser.loadGame({ whitePlayer: "White player", blackPlayer: "Black player", moves });
// gameBrowser.goToMove(24);
// let gameContainer = document.getElementById("chessgame") as HTMLElement;
// let chessgame = new Chessgame(gameContainer, "start", false);
let start = document.getElementById("start");
start.onclick = () => { gameBrowser.goToMove(-1); };
let rewind = document.getElementById("rewind");
rewind.onclick = () => { gameBrowser.rewind(); };
let previous = document.getElementById("prev");
previous.onclick = () => { gameBrowser.previous(); };
let play = document.getElementById("play");
play.onclick = () => { gameBrowser.play(); };
let pause = document.getElementById("pause");
pause.onclick = () => { gameBrowser.pause(); };
let next = document.getElementById("next");
next.onclick = () => { gameBrowser.next(); };
let forward = document.getElementById("forward");
forward.onclick = () => { gameBrowser.forward(); };
let end = document.getElementById("end");
end.onclick = () => { gameBrowser.goToMove(moves.length - 1); };
let rotate = document.getElementById("rotate");
rotate.onclick = () => { gameBrowser.rotate(); };
// goToMove.onclick = () => {gameBrowser.goToMove(24)};
// let img = document.getElementById("my-img") as HTMLImageElement;
// img.src = board2;
// let svg = createBackground();
// document.body.append(svg);
// debugger;
// setTargetAndSource("e2", "e4", svg);
// let board = document.getElementById("board") as HTMLElement;
// let svg = board.firstChild as HTMLImageElement;
// svg.src = boardbg;
// for (let element of board.children){
//     if (!element.classList.contains("background")){
//         let image = element.lastChild as HTMLImageElement;
//         if (image.classList.contains("wp")){
//             image.src = Icons.PieceUrl["P"];
//         }
//         else if (image.classList.contains("wr")){
//             image.src = Icons.PieceUrl["R"];
//         }
//         else if (image.classList.contains("wn")){
//             image.src = Icons.PieceUrl["N"];
//         }
//         else if (image.classList.contains("wb")){
//             image.src = Icons.PieceUrl["B"];
//         }
//         else if (image.classList.contains("wq")){
//             image.src = Icons.PieceUrl["Q"];
//         }
//         else if (image.classList.contains("wk")){
//             image.src = Icons.PieceUrl["K"];
//         }
//     }
// }
// let queen = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "*")[68];
// let bbox = king.getBoundingClientRect();
// console.log(bbox);
// let svgTags = document.getElementsByTagName("svg") as HTMLCollectionOf<SVGElement>;
// let queen = svgTags[1] as SVGElement;
// getBoundingBoxOfSvgPath(queen);
// import "../master.css";
// import { Chessboard } from "../../components/chess/Chessboard";
// let chessboardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(chessboardContainer, "start", false);


/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/b.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/b.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2) translate(2,3.6)","g":{"style":["fill:#000000; stroke:#000000; stroke-linecap:butt;","fill:#ffffff; stroke:#000000; stroke-linecap:butt;"],"path":[{"d":"M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"},{"d":"M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"},{"d":"M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"}],"g":{"path":[{"d":"M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18","style":["fill:none; stroke:#ffffff; stroke-linejoin:miter;","fill:none; stroke:#000000; stroke-linejoin:miter;"]}],"style":["opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(4,4.6)","opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(4,4.6)"]}}}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/k.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/k.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2.15) translate(0.7,-0.4)","style":["fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;","fill:none; fill-rule:evenodd;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5;transform:translate(2.5,1.5)"],"path":[{"colorIndex":0,"d":"M 22.5,11.63 L 22.5,6","style":["fill:none; stroke:#000000; stroke-linejoin:miter;","stroke-linejoin:miter"]},{"colorIndex":1,"d":"M22.5 11.63V6M20 8h5","style":["","stroke-linejoin:miter"]},{"colorIndex":0,"d":"M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25","style":["fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;","fill:#fff; stroke-linecap:butt; stroke-linejoin:miter"]},{"colorIndex":1,"d":"M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5","style":["","fill:#fff;stroke-linecap:butt;stroke-linejoin:miter"]},{"colorIndex":0,"d":"M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37","style":["fill:#000000; stroke:#000000;","fill:#fff"]},{"colorIndex":1,"d":"M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7","style":["","fill:#fff"]},{"colorIndex":0,"d":"M 20,8 L 25,8","style":["fill:none; stroke:#000000; stroke-linejoin:miter;",""]},{"colorIndex":0,"d":"M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5","style":["fill:none; stroke:#ffffff;",""]},{"colorIndex":0,"d":"M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37","style":["fill:none; stroke:#ffffff;",""]},{"colorIndex":1,"d":"M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"}]}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/n.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/n.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2) translate(2,3)","style":["opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;transform:translate(6,6.3)","opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)"],"path":[{"d":"M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18","style":["fill:#000000;stroke:#000000;","fill:#ffffff; stroke:#000000;"]},{"d":"M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10","style":["fill:#000000;stroke:#000000;","fill:#ffffff; stroke:#000000;"]},{"d":"M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z","style":["fill:#ffffff;stroke:#ffffff;","fill:#000000; stroke:#000000;"]},{"d":"M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z","style":["fill:#ffffff;stroke:#ffffff;transform:matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)","fill:#000000; stroke:#000000;transform:matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"]},{"d":"M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z","style":["fill:#ffffff; stroke:none;",""]}]}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/p.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/p.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2.2) translate(0,0)","path":[{"d":"m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z","style":["","fill:#ffffff;stroke:#000000;stroke-width:1.5;"]}]}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/q.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/q.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(1.89) translate(4.1,5.6)","style":["fill:#000000;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;transform:translate(5,7)","fill:#ffffff;stroke:#000000;stroke-width:1.5;stroke-linejoin:round;transform:translate(5,7)"],"path":[{"d":"M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z","style":["stroke-linecap:butt;fill:#000000",""]},{"colorIndex":1,"d":"M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"},{"colorIndex":0,"d":"m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z","style":["",""]},{"d":"M 11.5,30 C 15,29 30,29 33.5,30","style":["fill:none","fill:none"]},{"colorIndex":1,"d":"M 12,33.5 C 18,32.5 27,32.5 33,33.5","style":["","fill:none"]},{"colorIndex":0,"d":"m 12,33.5 c 6,-1 15,-1 21,0","style":["fill:none",""]},{"colorIndex":0,"d":"M 11,38.5 A 35,35 1 0 0 34,38.5","style":["fill:none; stroke:#000000;stroke-linecap:butt;",""]}],"circle":[{"cx":"6","cy":"12","r":"2"},{"cx":"14","cy":"9","r":"2"},{"cx":"22.5","cy":"8","r":"2"},{"cx":"31","cy":"9","r":"2"},{"cx":"39","cy":"12","r":"2"}],"g":{"style":["fill:none; stroke:#ffffff;",""],"path":[{"colorIndex":0,"d":"M 11,29 A 35,35 1 0 1 34,29"},{"colorIndex":0,"d":"M 12.5,31.5 L 32.5,31.5"},{"colorIndex":0,"d":"M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"},{"colorIndex":0,"d":"M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"}]}}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/r.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/r.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2) translate(2,3)","style":["opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)","opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)"],"path":[{"d":"M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z","colorIndex":0,"style":["stroke-linecap:butt;",""]},{"d":"M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z","colorIndex":0,"style":["stroke-linecap:butt;stroke-linejoin:miter;",""]},{"d":"M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z","colorIndex":0,"style":["stroke-linecap:butt;",""]},{"d":"M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 12,35.5 L 33,35.5 L 33,35.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 13,31.5 L 32,31.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 14,29.5 L 31,29.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 14,16.5 L 31,16.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 11,14 L 34,14","style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;","fill:none; stroke:#000000; stroke-linejoin:miter;"]},{"d":"M 34,14 L 31,17 L 14,17 L 11,14","colorIndex":1},{"d":"M 31,17 L 31,29.5 L 14,29.5 L 14,17","colorIndex":1,"style":["stroke-linecap:butt; stroke-linejoin:miter;"]},{"d":"M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5","colorIndex":1,"style":[]}]}}}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/pages/openings/Openings.ts"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlbmluZ3MuY2UyZDk5NjcyMjRhYzcwMDY1N2QuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywrQkFBK0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsYUFBYTtBQUN2Qix3QkFBd0IsYUFBYTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixjQUFjO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsK0JBQStCO0FBQ2pFO0FBQ0EsNENBQTRDLFNBQVM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsU0FBUztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGNBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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TFMsWUFBWSxLQUFaLFlBQVksUUFLckI7QUFDRCxxQkFBZSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNUNUIsSUFBVSxNQUFNLENBK0NmO0FBL0NELFdBQVUsTUFBTTtJQUNaLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcFosTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDNUQsTUFBTSxRQUFRLEdBQUcsQ0FB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QUNyQixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDO2dCQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUM7UUFDTCxDQUFDO1FBQUEsQ0FBQztRQUNGLDRDQUE0QztRQUM1QyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0MsNkVBQTZFO1FBQzdFLElBQUksUUFBUSxHQUEyQixFQUFFLENBQUM7UUFDMUMsc0ZBQXNGO1FBQ3RGLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDLENBQUM7WUFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQyxDQUFDO1lBQzNCLFFBQVEsQ0FBQyxJQUFJ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TSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFzQixDQUFDO0FBQ3BFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFDLENBQUM7QUFFOUMsdURBQXVEO0FBR3ZELG1FQUFtRTtBQUNuRSxvQkFBb0I7QUFDcEIsZ0NBQWdDO0FBQ2hDLDZCQUE2QjtBQUM3QixZQUFZO0FBRVosdUNBQXVDO0FBRXZDLCtEQUErRDtBQUMvRCxrREFBa0Q7QUFDbEQscUJBQXFCO0FBQ3JCLHVDQUF1QztBQUN2QyxzREFBc0Q7QUFDdEQsNkRBQTZEO0FBQzdELCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLFFBQVE7QUFFUixJQUFJO0FBQ0osc0ZBQXNGO0FBQ3RGLDJDQUEyQztBQUMzQyxxQkFBcUI7QUFFckIsc0ZBQXNGO0FBQ3RGLHdDQUF3QztBQUN4QyxrQ0FBa0M7QUFFbEMsMEJBQTBCO0FBQzFCLGtFQUFrRTtBQUVsRSxrRkFBa0Y7QUFDbEYsd0VBQXdFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9jaGVzcy5qcy9kaXN0L2VzbS9jaGVzcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvZ2FtZUJyb3dzZXIvZ2FtZUJyb3dzZXIuY3NzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvcGFnZXMvb3BlbmluZ3Mvb3BlbmluZ3MuY3NzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvZ2FtZUJyb3dzZXIvZ2FtZUJyb3dzZXIuY3NzPzY3NGIiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9wYWdlcy9vcGVuaW5ncy9vcGVuaW5ncy5jc3M/YTgyZSIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9jaGVzc2JvYXJkL0NoZXNzYm9hcmQudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL0Fycm93TGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL0JvYXJkTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL0NvcmRzTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL1BpZWNlTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTW91c2VFdmVudHMudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvUGllY2VFbGVtZW50RmFjdG9yeS50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9QaWVjZUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvU2hhcmVkLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9jaGVzc2JvYXJkL1NxdWFyZUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVCcm93c2VyL0NhcHR1cmVQaWVjZUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVCcm93c2VyL0dhbWVCcm93c2VyLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9nYW1lQnJvd3Nlci9QbGF5ZXJJbmZvLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9nYW1lQnJvd3Nlci9UcmFuc2l0aW9uTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9wYWdlcy9vcGVuaW5ncy9PcGVuaW5ncy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjMsIEplZmYgSGx5d2EgKGpobHl3YUBnbWFpbC5jb20pXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqICAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gKiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXG4gKiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRlxuICogU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxuICogQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSlcbiAqIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuZXhwb3J0IGNvbnN0IFdISVRFID0gJ3cnO1xuZXhwb3J0IGNvbnN0IEJMQUNLID0gJ2InO1xuZXhwb3J0IGNvbnN0IFBBV04gPSAncCc7XG5leHBvcnQgY29uc3QgS05JR0hUID0gJ24nO1xuZXhwb3J0IGNvbnN0IEJJU0hPUCA9ICdiJztcbmV4cG9ydCBjb25zdCBST09LID0gJ3InO1xuZXhwb3J0IGNvbnN0IFFVRUVOID0gJ3EnO1xuZXhwb3J0IGNvbnN0IEtJTkcgPSAnayc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9QT1NJVElPTiA9ICdybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMSc7XG5jb25zdCBFTVBUWSA9IC0xO1xuY29uc3QgRkxBR1MgPSB7XG4gICAgTk9STUFMOiAnbicsXG4gICAgQ0FQVFVSRTogJ2MnLFxuICAgIEJJR19QQVdOOiAnYicsXG4gICAgRVBfQ0FQVFVSRTogJ2UnLFxuICAgIFBST01PVElPTjogJ3AnLFxuICAgIEtTSURFX0NBU1RMRTogJ2snLFxuICAgIFFTSURFX0NBU1RMRTogJ3EnLFxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuZXhwb3J0IGNvbnN0IFNRVUFSRVMgPSBbXG4gICAgJ2E4JywgJ2I4JywgJ2M4JywgJ2Q4JywgJ2U4JywgJ2Y4JywgJ2c4JywgJ2g4JyxcbiAgICAnYTcnLCAnYjcnLCAnYzcnLCAnZDcnLCAnZTcnLCAnZjcnLCAnZzcnLCAnaDcnLFxuICAgICdhNicsICdiNicsICdjNicsICdkNicsICdlNicsICdmNicsICdnNicsICdoNicsXG4gICAgJ2E1JywgJ2I1JywgJ2M1JywgJ2Q1JywgJ2U1JywgJ2Y1JywgJ2c1JywgJ2g1JyxcbiAgICAnYTQnLCAnYjQnLCAnYzQnLCAnZDQnLCAnZTQnLCAnZjQnLCAnZzQnLCAnaDQnLFxuICAgICdhMycsICdiMycsICdjMycsICdkMycsICdlMycsICdmMycsICdnMycsICdoMycsXG4gICAgJ2EyJywgJ2IyJywgJ2MyJywgJ2QyJywgJ2UyJywgJ2YyJywgJ2cyJywgJ2gyJyxcbiAgICAnYTEnLCAnYjEnLCAnYzEnLCAnZDEnLCAnZTEnLCAnZjEnLCAnZzEnLCAnaDEnXG5dO1xuY29uc3QgQklUUyA9IHtcbiAgICBOT1JNQUw6IDEsXG4gICAgQ0FQVFVSRTogMixcbiAgICBCSUdfUEFXTjogNCxcbiAgICBFUF9DQVBUVVJFOiA4LFxuICAgIFBST01PVElPTjogMTYsXG4gICAgS1NJREVfQ0FTVExFOiAzMixcbiAgICBRU0lERV9DQVNUTEU6IDY0LFxufTtcbi8qXG4gKiBOT1RFUyBBQk9VVCAweDg4IE1PVkUgR0VORVJBVElPTiBBTEdPUklUSE1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL2pobHl3YS9jaGVzcy5qcy9pc3N1ZXMvMjMwXG4gKlxuICogQSBsb3Qgb2YgcGVvcGxlIGFyZSBjb25mdXNlZCB3aGVuIHRoZXkgZmlyc3Qgc2VlIHRoZSBpbnRlcm5hbCByZXByZXNlbnRhdGlvblxuICogb2YgY2hlc3MuanMuIEl0IHVzZXMgdGhlIDB4ODggTW92ZSBHZW5lcmF0aW9uIEFsZ29yaXRobSB3aGljaCBpbnRlcm5hbGx5XG4gKiBzdG9yZXMgdGhlIGJvYXJkIGFzIGFuIDh4MTYgYXJyYXkuIFRoaXMgaXMgcHVyZWx5IGZvciBlZmZpY2llbmN5IGJ1dCBoYXMgYVxuICogY291cGxlIG9mIGludGVyZXN0aW5nIGJlbmVmaXRzOlxuICpcbiAqIDEuIDB4ODggb2ZmZXJzIGEgdmVyeSBpbmV4cGVuc2l2ZSBcIm9mZiB0aGUgYm9hcmRcIiBjaGVjay4gQml0d2lzZSBBTkQgKCYpIGFueVxuICogICAgc3F1YXJlIHdpdGggMHg4OCwgaWYgdGhlIHJlc3VsdCBpcyBub24temVybyB0aGVuIHRoZSBzcXVhcmUgaXMgb2ZmIHRoZVxuICogICAgYm9hcmQuIEZvciBleGFtcGxlLCBhc3N1bWluZyBhIGtuaWdodCBzcXVhcmUgQTggKDAgaW4gMHg4OCBub3RhdGlvbiksXG4gKiAgICB0aGVyZSBhcmUgOCBwb3NzaWJsZSBkaXJlY3Rpb25zIGluIHdoaWNoIHRoZSBrbmlnaHQgY2FuIG1vdmUuIFRoZXNlXG4gKiAgICBkaXJlY3Rpb25zIGFyZSByZWxhdGl2ZSB0byB0aGUgOHgxNiBib2FyZCBhbmQgYXJlIHN0b3JlZCBpbiB0aGVcbiAqICAgIFBJRUNFX09GRlNFVFMgbWFwLiBPbmUgcG9zc2libGUgbW92ZSBpcyBBOCAtIDE4ICh1cCBvbmUgc3F1YXJlLCBhbmQgdHdvXG4gKiAgICBzcXVhcmVzIHRvIHRoZSBsZWZ0IC0gd2hpY2ggaXMgb2ZmIHRoZSBib2FyZCkuIDAgLSAxOCA9IC0xOCAmIDB4ODggPSAweDg4XG4gKiAgICAoYmVjYXVzZSBvZiB0d28tY29tcGxlbWVudCByZXByZXNlbnRhdGlvbiBvZiAtMTgpLiBUaGUgbm9uLXplcm8gcmVzdWx0XG4gKiAgICBtZWFucyB0aGUgc3F1YXJlIGlzIG9mZiB0aGUgYm9hcmQgYW5kIHRoZSBtb3ZlIGlzIGlsbGVnYWwuIFRha2UgdGhlXG4gKiAgICBvcHBvc2l0ZSBtb3ZlIChmcm9tIEE4IHRvIEM3KSwgMCArIDE4ID0gMTggJiAweDg4ID0gMC4gQSByZXN1bHQgb2YgemVyb1xuICogICAgbWVhbnMgdGhlIHNxdWFyZSBpcyBvbiB0aGUgYm9hcmQuXG4gKlxuICogMi4gVGhlIHJlbGF0aXZlIGRpc3RhbmNlIChvciBkaWZmZXJlbmNlKSBiZXR3ZWVuIHR3byBzcXVhcmVzIG9uIGEgOHgxNiBib2FyZFxuICogICAgaXMgdW5pcXVlIGFuZCBjYW4gYmUgdXNlZCB0byBpbmV4cGVuc2l2ZWx5IGRldGVybWluZSBpZiBhIHBpZWNlIG9uIGFcbiAqICAgIHNxdWFyZSBjYW4gYXR0YWNrIGFueSBvdGhlciBhcmJpdHJhcnkgc3F1YXJlLiBGb3IgZXhhbXBsZSwgbGV0J3Mgc2VlIGlmIGFcbiAqICAgIHBhd24gb24gRTcgY2FuIGF0dGFjayBFMi4gVGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBFNyAoMjApIC0gRTIgKDEwMCkgaXNcbiAqICAgIC04MC4gV2UgYWRkIDExOSB0byBtYWtlIHRoZSBBVFRBQ0tTIGFycmF5IGluZGV4IG5vbi1uZWdhdGl2ZSAoYmVjYXVzZSB0aGVcbiAqICAgIHdvcnN0IGNhc2UgZGlmZmVyZW5jZSBpcyBBOCAtIEgxID0gLTExOSkuIFRoZSBBVFRBQ0tTIGFycmF5IGNvbnRhaW5zIGFcbiAqICAgIGJpdG1hc2sgb2YgcGllY2VzIHRoYXQgY2FuIGF0dGFjayBmcm9tIHRoYXQgZGlzdGFuY2UgYW5kIGRpcmVjdGlvbi5cbiAqICAgIEFUVEFDS1NbLTgwICsgMTE5PTM5XSBnaXZlcyB1cyAyNCBvciAwYjExMDAwIGluIGJpbmFyeS4gTG9vayBhdCB0aGVcbiAqICAgIFBJRUNFX01BU0tTIG1hcCB0byBkZXRlcm1pbmUgdGhlIG1hc2sgZm9yIGEgZ2l2ZW4gcGllY2UgdHlwZS4gSW4gb3VyIHBhd25cbiAqICAgIGV4YW1wbGUsIHdlIHdvdWxkIGNoZWNrIHRvIHNlZSBpZiAyNCAmIDB4MSBpcyBub24temVybywgd2hpY2ggaXQgaXNcbiAqICAgIG5vdC4gU28sIG5hdHVyYWxseSwgYSBwYXduIG9uIEU3IGNhbid0IGF0dGFjayBhIHBpZWNlIG9uIEUyLiBIb3dldmVyLCBhXG4gKiAgICByb29rIGNhbiBzaW5jZSAyNCAmIDB4OCBpcyBub24temVyby4gVGhlIG9ubHkgdGhpbmcgbGVmdCB0byBjaGVjayBpcyB0aGF0XG4gKiAgICB0aGVyZSBhcmUgbm8gYmxvY2tpbmcgcGllY2VzIGJldHdlZW4gRTcgYW5kIEUyLiBUaGF0J3Mgd2hlcmUgdGhlIFJBWVNcbiAqICAgIGFycmF5IGNvbWVzIGluLiBJdCBwcm92aWRlcyBhbiBvZmZzZXQgKGluIHRoaXMgY2FzZSAxNikgdG8gYWRkIHRvIEU3ICgyMClcbiAqICAgIHRvIGNoZWNrIGZvciBibG9ja2luZyBwaWVjZXMuIEU3ICgyMCkgKyAxNiA9IEU2ICgzNikgKyAxNiA9IEU1ICg1MikgZXRjLlxuICovXG4vLyBwcmV0dGllci1pZ25vcmVcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuY29uc3QgT3g4OCA9IHtcbiAgICBhODogMCwgYjg6IDEsIGM4OiAyLCBkODogMywgZTg6IDQsIGY4OiA1LCBnODogNiwgaDg6IDcsXG4gICAgYTc6IDE2LCBiNzogMTcsIGM3OiAxOCwgZDc6IDE5LCBlNzogMjAsIGY3OiAyMSwgZzc6IDIyLCBoNzogMjMsXG4gICAgYTY6IDMyLCBiNjogMzMsIGM2OiAzNCwgZDY6IDM1LCBlNjogMzYsIGY2OiAzNywgZzY6IDM4LCBoNjogMzksXG4gICAgYTU6IDQ4LCBiNTogNDksIGM1OiA1MCwgZDU6IDUxLCBlNTogNTIsIGY1OiA1MywgZzU6IDU0LCBoNTogNTUsXG4gICAgYTQ6IDY0LCBiNDogNjUsIGM0OiA2NiwgZDQ6IDY3LCBlNDogNjgsIGY0OiA2OSwgZzQ6IDcwLCBoNDogNzEsXG4gICAgYTM6IDgwLCBiMzogODEsIGMzOiA4MiwgZDM6IDgzLCBlMzogODQsIGYzOiA4NSwgZzM6IDg2LCBoMzogODcsXG4gICAgYTI6IDk2LCBiMjogOTcsIGMyOiA5OCwgZDI6IDk5LCBlMjogMTAwLCBmMjogMTAxLCBnMjogMTAyLCBoMjogMTAzLFxuICAgIGExOiAxMTIsIGIxOiAxMTMsIGMxOiAxMTQsIGQxOiAxMTUsIGUxOiAxMTYsIGYxOiAxMTcsIGcxOiAxMTgsIGgxOiAxMTlcbn07XG5jb25zdCBQQVdOX09GRlNFVFMgPSB7XG4gICAgYjogWzE2LCAzMiwgMTcsIDE1XSxcbiAgICB3OiBbLTE2LCAtMzIsIC0xNywgLTE1XSxcbn07XG5jb25zdCBQSUVDRV9PRkZTRVRTID0ge1xuICAgIG46IFstMTgsIC0zMywgLTMxLCAtMTQsIDE4LCAzMywgMzEsIDE0XSxcbiAgICBiOiBbLTE3LCAtMTUsIDE3LCAxNV0sXG4gICAgcjogWy0xNiwgMSwgMTYsIC0xXSxcbiAgICBxOiBbLTE3LCAtMTYsIC0xNSwgMSwgMTcsIDE2LCAxNSwgLTFdLFxuICAgIGs6IFstMTcsIC0xNiwgLTE1LCAxLCAxNywgMTYsIDE1LCAtMV0sXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG5jb25zdCBBVFRBQ0tTID0gW1xuICAgIDIwLCAwLCAwLCAwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMCwgMCwgMCwgMjAsIDAsXG4gICAgMCwgMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAwLCAwLCAyMCwgMCwgMCxcbiAgICAwLCAwLCAyMCwgMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDAsIDIwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDIwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMjAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMjAsIDAsIDAsIDI0LCAwLCAwLCAyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAyMCwgMiwgMjQsIDIsIDIwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDIsIDUzLCA1NiwgNTMsIDIsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgNTYsIDAsIDU2LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDIsIDUzLCA1NiwgNTMsIDIsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgMjAsIDIsIDI0LCAyLCAyMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAyMCwgMCwgMCwgMjQsIDAsIDAsIDIwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDIwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMjAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMjAsIDAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAwLCAyMCwgMCwgMCwgMCxcbiAgICAwLCAyMCwgMCwgMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDAsIDAsIDIwLCAwLCAwLFxuICAgIDIwLCAwLCAwLCAwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMCwgMCwgMCwgMjBcbl07XG4vLyBwcmV0dGllci1pZ25vcmVcbmNvbnN0IFJBWVMgPSBbXG4gICAgMTcsIDAsIDAsIDAsIDAsIDAsIDAsIDE2LCAwLCAwLCAwLCAwLCAwLCAwLCAxNSwgMCxcbiAgICAwLCAxNywgMCwgMCwgMCwgMCwgMCwgMTYsIDAsIDAsIDAsIDAsIDAsIDE1LCAwLCAwLFxuICAgIDAsIDAsIDE3LCAwLCAwLCAwLCAwLCAxNiwgMCwgMCwgMCwgMCwgMTUsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMTcsIDAsIDAsIDAsIDE2LCAwLCAwLCAwLCAxNSwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAxNywgMCwgMCwgMTYsIDAsIDAsIDE1LCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDE3LCAwLCAxNiwgMCwgMTUsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgMCwgMTcsIDE2LCAxNSwgMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAwLCAtMTUsIC0xNiwgLTE3LCAwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIC0xNSwgMCwgLTE2LCAwLCAtMTcsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgLTE1LCAwLCAwLCAtMTYsIDAsIDAsIC0xNywgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAtMTUsIDAsIDAsIDAsIC0xNiwgMCwgMCwgMCwgLTE3LCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIC0xNSwgMCwgMCwgMCwgMCwgLTE2LCAwLCAwLCAwLCAwLCAtMTcsIDAsIDAsIDAsXG4gICAgMCwgLTE1LCAwLCAwLCAwLCAwLCAwLCAtMTYsIDAsIDAsIDAsIDAsIDAsIC0xNywgMCwgMCxcbiAgICAtMTUsIDAsIDAsIDAsIDAsIDAsIDAsIC0xNiwgMCwgMCwgMCwgMCwgMCwgMCwgLTE3XG5dO1xuY29uc3QgUElFQ0VfTUFTS1MgPSB7IHA6IDB4MSwgbjogMHgyLCBiOiAweDQsIHI6IDB4OCwgcTogMHgxMCwgazogMHgyMCB9O1xuY29uc3QgU1lNQk9MUyA9ICdwbmJycWtQTkJSUUsnO1xuY29uc3QgUFJPTU9USU9OUyA9IFtLTklHSFQsIEJJU0hPUCwgUk9PSywgUVVFRU5dO1xuY29uc3QgUkFOS18xID0gNztcbmNvbnN0IFJBTktfMiA9IDY7XG4vKlxuICogY29uc3QgUkFOS18zID0gNVxuICogY29uc3QgUkFOS180ID0gNFxuICogY29uc3QgUkFOS181ID0gM1xuICogY29uc3QgUkFOS182ID0gMlxuICovXG5jb25zdCBSQU5LXzcgPSAxO1xuY29uc3QgUkFOS184ID0gMDtcbmNvbnN0IFNJREVTID0ge1xuICAgIFtLSU5HXTogQklUUy5LU0lERV9DQVNUTEUsXG4gICAgW1FVRUVOXTogQklUUy5RU0lERV9DQVNUTEUsXG59O1xuY29uc3QgUk9PS1MgPSB7XG4gICAgdzogW1xuICAgICAgICB7IHNxdWFyZTogT3g4OC5hMSwgZmxhZzogQklUUy5RU0lERV9DQVNUTEUgfSxcbiAgICAgICAgeyBzcXVhcmU6IE94ODguaDEsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFIH0sXG4gICAgXSxcbiAgICBiOiBbXG4gICAgICAgIHsgc3F1YXJlOiBPeDg4LmE4LCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRSB9LFxuICAgICAgICB7IHNxdWFyZTogT3g4OC5oOCwgZmxhZzogQklUUy5LU0lERV9DQVNUTEUgfSxcbiAgICBdLFxufTtcbmNvbnN0IFNFQ09ORF9SQU5LID0geyBiOiBSQU5LXzcsIHc6IFJBTktfMiB9O1xuY29uc3QgVEVSTUlOQVRJT05fTUFSS0VSUyA9IFsnMS0wJywgJzAtMScsICcxLzItMS8yJywgJyonXTtcbi8vIEV4dHJhY3RzIHRoZSB6ZXJvLWJhc2VkIHJhbmsgb2YgYW4gMHg4OCBzcXVhcmUuXG5mdW5jdGlvbiByYW5rKHNxdWFyZSkge1xuICAgIHJldHVybiBzcXVhcmUgPj4gNDtcbn1cbi8vIEV4dHJhY3RzIHRoZSB6ZXJvLWJhc2VkIGZpbGUgb2YgYW4gMHg4OCBzcXVhcmUuXG5mdW5jdGlvbiBmaWxlKHNxdWFyZSkge1xuICAgIHJldHVybiBzcXVhcmUgJiAweGY7XG59XG5mdW5jdGlvbiBpc0RpZ2l0KGMpIHtcbiAgICByZXR1cm4gJzAxMjM0NTY3ODknLmluZGV4T2YoYykgIT09IC0xO1xufVxuLy8gQ29udmVydHMgYSAweDg4IHNxdWFyZSB0byBhbGdlYnJhaWMgbm90YXRpb24uXG5mdW5jdGlvbiBhbGdlYnJhaWMoc3F1YXJlKSB7XG4gICAgY29uc3QgZiA9IGZpbGUoc3F1YXJlKTtcbiAgICBjb25zdCByID0gcmFuayhzcXVhcmUpO1xuICAgIHJldHVybiAoJ2FiY2RlZmdoJy5zdWJzdHJpbmcoZiwgZiArIDEpICtcbiAgICAgICAgJzg3NjU0MzIxJy5zdWJzdHJpbmcociwgciArIDEpKTtcbn1cbmZ1bmN0aW9uIHN3YXBDb2xvcihjb2xvcikge1xuICAgIHJldHVybiBjb2xvciA9PT0gV0hJVEUgPyBCTEFDSyA6IFdISVRFO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRmVuKGZlbikge1xuICAgIC8vIDFzdCBjcml0ZXJpb246IDYgc3BhY2Utc2VwZXJhdGVkIGZpZWxkcz9cbiAgICBjb25zdCB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCAhPT0gNikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIEZFTjogbXVzdCBjb250YWluIHNpeCBzcGFjZS1kZWxpbWl0ZWQgZmllbGRzJyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gMm5kIGNyaXRlcmlvbjogbW92ZSBudW1iZXIgZmllbGQgaXMgYSBpbnRlZ2VyIHZhbHVlID4gMD9cbiAgICBjb25zdCBtb3ZlTnVtYmVyID0gcGFyc2VJbnQodG9rZW5zWzVdLCAxMCk7XG4gICAgaWYgKGlzTmFOKG1vdmVOdW1iZXIpIHx8IG1vdmVOdW1iZXIgPD0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIEZFTjogbW92ZSBudW1iZXIgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyAzcmQgY3JpdGVyaW9uOiBoYWxmIG1vdmUgY291bnRlciBpcyBhbiBpbnRlZ2VyID49IDA/XG4gICAgY29uc3QgaGFsZk1vdmVzID0gcGFyc2VJbnQodG9rZW5zWzRdLCAxMCk7XG4gICAgaWYgKGlzTmFOKGhhbGZNb3ZlcykgfHwgaGFsZk1vdmVzIDwgMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIEZFTjogaGFsZiBtb3ZlIGNvdW50ZXIgbnVtYmVyIG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlcicsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIDR0aCBjcml0ZXJpb246IDR0aCBmaWVsZCBpcyBhIHZhbGlkIGUucC4tc3RyaW5nP1xuICAgIGlmICghL14oLXxbYWJjZGVmZ2hdWzM2XSkkLy50ZXN0KHRva2Vuc1szXSkpIHtcbiAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgRkVOOiBlbi1wYXNzYW50IHNxdWFyZSBpcyBpbnZhbGlkJyB9O1xuICAgIH1cbiAgICAvLyA1dGggY3JpdGVyaW9uOiAzdGggZmllbGQgaXMgYSB2YWxpZCBjYXN0bGUtc3RyaW5nP1xuICAgIGlmICgvW15rS3FRLV0vLnRlc3QodG9rZW5zWzJdKSkge1xuICAgICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBGRU46IGNhc3RsaW5nIGF2YWlsYWJpbGl0eSBpcyBpbnZhbGlkJyB9O1xuICAgIH1cbiAgICAvLyA2dGggY3JpdGVyaW9uOiAybmQgZmllbGQgaXMgXCJ3XCIgKHdoaXRlKSBvciBcImJcIiAoYmxhY2spP1xuICAgIGlmICghL14od3xiKSQvLnRlc3QodG9rZW5zWzFdKSkge1xuICAgICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBGRU46IHNpZGUtdG8tbW92ZSBpcyBpbnZhbGlkJyB9O1xuICAgIH1cbiAgICAvLyA3dGggY3JpdGVyaW9uOiAxc3QgZmllbGQgY29udGFpbnMgOCByb3dzP1xuICAgIGNvbnN0IHJvd3MgPSB0b2tlbnNbMF0uc3BsaXQoJy8nKTtcbiAgICBpZiAocm93cy5sZW5ndGggIT09IDgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiBcIkludmFsaWQgRkVOOiBwaWVjZSBkYXRhIGRvZXMgbm90IGNvbnRhaW4gOCAnLyctZGVsaW1pdGVkIHJvd3NcIixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gOHRoIGNyaXRlcmlvbjogZXZlcnkgcm93IGlzIHZhbGlkP1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBjaGVjayBmb3IgcmlnaHQgc3VtIG9mIGZpZWxkcyBBTkQgbm90IHR3byBudW1iZXJzIGluIHN1Y2Nlc3Npb25cbiAgICAgICAgbGV0IHN1bUZpZWxkcyA9IDA7XG4gICAgICAgIGxldCBwcmV2aW91c1dhc051bWJlciA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHJvd3NbaV0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChpc0RpZ2l0KHJvd3NbaV1ba10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzV2FzTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ0ludmFsaWQgRkVOOiBwaWVjZSBkYXRhIGlzIGludmFsaWQgKGNvbnNlY3V0aXZlIG51bWJlciknLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdW1GaWVsZHMgKz0gcGFyc2VJbnQocm93c1tpXVtrXSwgMTApO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzV2FzTnVtYmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghL15bcHJuYnFrUFJOQlFLXSQvLnRlc3Qocm93c1tpXVtrXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBGRU46IHBpZWNlIGRhdGEgaXMgaW52YWxpZCAoaW52YWxpZCBwaWVjZSknLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdW1GaWVsZHMgKz0gMTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1dhc051bWJlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdW1GaWVsZHMgIT09IDgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBGRU46IHBpZWNlIGRhdGEgaXMgaW52YWxpZCAodG9vIG1hbnkgc3F1YXJlcyBpbiByYW5rKScsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIDl0aCBjcml0ZXJpb246IGlzIGVuLXBhc3NhbnQgc3F1YXJlIGxlZ2FsP1xuICAgIGlmICgodG9rZW5zWzNdWzFdID09ICczJyAmJiB0b2tlbnNbMV0gPT0gJ3cnKSB8fFxuICAgICAgICAodG9rZW5zWzNdWzFdID09ICc2JyAmJiB0b2tlbnNbMV0gPT0gJ2InKSkge1xuICAgICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBGRU46IGlsbGVnYWwgZW4tcGFzc2FudCBzcXVhcmUnIH07XG4gICAgfVxuICAgIC8vIDEwdGggY3JpdGVyaW9uOiBkb2VzIGNoZXNzIHBvc2l0aW9uIGNvbnRhaW4gZXhhY3QgdHdvIGtpbmdzP1xuICAgIGNvbnN0IGtpbmdzID0gW1xuICAgICAgICB7IGNvbG9yOiAnd2hpdGUnLCByZWdleDogL0svZyB9LFxuICAgICAgICB7IGNvbG9yOiAnYmxhY2snLCByZWdleDogL2svZyB9LFxuICAgIF07XG4gICAgZm9yIChjb25zdCB7IGNvbG9yLCByZWdleCB9IG9mIGtpbmdzKSB7XG4gICAgICAgIGlmICghcmVnZXgudGVzdCh0b2tlbnNbMF0pKSB7XG4gICAgICAgICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBgSW52YWxpZCBGRU46IG1pc3NpbmcgJHtjb2xvcn0ga2luZ2AgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHRva2Vuc1swXS5tYXRjaChyZWdleCkgfHwgW10pLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IGBJbnZhbGlkIEZFTjogdG9vIG1hbnkgJHtjb2xvcn0ga2luZ3NgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gMTF0aCBjcml0ZXJpb246IGFyZSBhbnkgcGF3bnMgb24gdGhlIGZpcnN0IG9yIGVpZ2h0aCByb3dzP1xuICAgIGlmIChBcnJheS5mcm9tKHJvd3NbMF0gKyByb3dzWzddKS5zb21lKChjaGFyKSA9PiBjaGFyLnRvVXBwZXJDYXNlKCkgPT09ICdQJykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBGRU46IHNvbWUgcGF3bnMgYXJlIG9uIHRoZSBlZGdlIHJvd3MnLFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4geyBvazogdHJ1ZSB9O1xufVxuLy8gdGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGFtYmlndW91cyBtb3Zlc1xuZnVuY3Rpb24gZ2V0RGlzYW1iaWd1YXRvcihtb3ZlLCBtb3Zlcykge1xuICAgIGNvbnN0IGZyb20gPSBtb3ZlLmZyb207XG4gICAgY29uc3QgdG8gPSBtb3ZlLnRvO1xuICAgIGNvbnN0IHBpZWNlID0gbW92ZS5waWVjZTtcbiAgICBsZXQgYW1iaWd1aXRpZXMgPSAwO1xuICAgIGxldCBzYW1lUmFuayA9IDA7XG4gICAgbGV0IHNhbWVGaWxlID0gMDtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3QgYW1iaWdGcm9tID0gbW92ZXNbaV0uZnJvbTtcbiAgICAgICAgY29uc3QgYW1iaWdUbyA9IG1vdmVzW2ldLnRvO1xuICAgICAgICBjb25zdCBhbWJpZ1BpZWNlID0gbW92ZXNbaV0ucGllY2U7XG4gICAgICAgIC8qXG4gICAgICAgICAqIGlmIGEgbW92ZSBvZiB0aGUgc2FtZSBwaWVjZSB0eXBlIGVuZHMgb24gdGhlIHNhbWUgdG8gc3F1YXJlLCB3ZSdsbCBuZWVkXG4gICAgICAgICAqIHRvIGFkZCBhIGRpc2FtYmlndWF0b3IgdG8gdGhlIGFsZ2VicmFpYyBub3RhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHBpZWNlID09PSBhbWJpZ1BpZWNlICYmIGZyb20gIT09IGFtYmlnRnJvbSAmJiB0byA9PT0gYW1iaWdUbykge1xuICAgICAgICAgICAgYW1iaWd1aXRpZXMrKztcbiAgICAgICAgICAgIGlmIChyYW5rKGZyb20pID09PSByYW5rKGFtYmlnRnJvbSkpIHtcbiAgICAgICAgICAgICAgICBzYW1lUmFuaysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpbGUoZnJvbSkgPT09IGZpbGUoYW1iaWdGcm9tKSkge1xuICAgICAgICAgICAgICAgIHNhbWVGaWxlKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFtYmlndWl0aWVzID4gMCkge1xuICAgICAgICBpZiAoc2FtZVJhbmsgPiAwICYmIHNhbWVGaWxlID4gMCkge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIGlmIHRoZXJlIGV4aXN0cyBhIHNpbWlsYXIgbW92aW5nIHBpZWNlIG9uIHRoZSBzYW1lIHJhbmsgYW5kIGZpbGUgYXNcbiAgICAgICAgICAgICAqIHRoZSBtb3ZlIGluIHF1ZXN0aW9uLCB1c2UgdGhlIHNxdWFyZSBhcyB0aGUgZGlzYW1iaWd1YXRvclxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNhbWVGaWxlID4gMCkge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIGlmIHRoZSBtb3ZpbmcgcGllY2UgcmVzdHMgb24gdGhlIHNhbWUgZmlsZSwgdXNlIHRoZSByYW5rIHN5bWJvbCBhcyB0aGVcbiAgICAgICAgICAgICAqIGRpc2FtYmlndWF0b3JcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKS5jaGFyQXQoMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBlbHNlIHVzZSB0aGUgZmlsZSBzeW1ib2xcbiAgICAgICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSkuY2hhckF0KDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbmZ1bmN0aW9uIGFkZE1vdmUobW92ZXMsIGNvbG9yLCBmcm9tLCB0bywgcGllY2UsIGNhcHR1cmVkID0gdW5kZWZpbmVkLCBmbGFncyA9IEJJVFMuTk9STUFMKSB7XG4gICAgY29uc3QgciA9IHJhbmsodG8pO1xuICAgIGlmIChwaWVjZSA9PT0gUEFXTiAmJiAociA9PT0gUkFOS18xIHx8IHIgPT09IFJBTktfOCkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBQUk9NT1RJT05TLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9tb3Rpb24gPSBQUk9NT1RJT05TW2ldO1xuICAgICAgICAgICAgbW92ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgICAgICB0byxcbiAgICAgICAgICAgICAgICBwaWVjZSxcbiAgICAgICAgICAgICAgICBjYXB0dXJlZCxcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb24sXG4gICAgICAgICAgICAgICAgZmxhZ3M6IGZsYWdzIHwgQklUUy5QUk9NT1RJT04sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbW92ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICB0byxcbiAgICAgICAgICAgIHBpZWNlLFxuICAgICAgICAgICAgY2FwdHVyZWQsXG4gICAgICAgICAgICBmbGFncyxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5mZXJQaWVjZVR5cGUoc2FuKSB7XG4gICAgbGV0IHBpZWNlVHlwZSA9IHNhbi5jaGFyQXQoMCk7XG4gICAgaWYgKHBpZWNlVHlwZSA+PSAnYScgJiYgcGllY2VUeXBlIDw9ICdoJykge1xuICAgICAgICBjb25zdCBtYXRjaGVzID0gc2FuLm1hdGNoKC9bYS1oXVxcZC4qW2EtaF1cXGQvKTtcbiAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBBV047XG4gICAgfVxuICAgIHBpZWNlVHlwZSA9IHBpZWNlVHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChwaWVjZVR5cGUgPT09ICdvJykge1xuICAgICAgICByZXR1cm4gS0lORztcbiAgICB9XG4gICAgcmV0dXJuIHBpZWNlVHlwZTtcbn1cbi8vIHBhcnNlcyBhbGwgb2YgdGhlIGRlY29yYXRvcnMgb3V0IG9mIGEgU0FOIHN0cmluZ1xuZnVuY3Rpb24gc3RyaXBwZWRTYW4obW92ZSkge1xuICAgIHJldHVybiBtb3ZlLnJlcGxhY2UoLz0vLCAnJykucmVwbGFjZSgvWysjXT9bPyFdKiQvLCAnJyk7XG59XG5mdW5jdGlvbiB0cmltRmVuKGZlbikge1xuICAgIC8qXG4gICAgICogcmVtb3ZlIGxhc3QgdHdvIGZpZWxkcyBpbiBGRU4gc3RyaW5nIGFzIHRoZXkncmUgbm90IG5lZWRlZCB3aGVuIGNoZWNraW5nXG4gICAgICogZm9yIHJlcGV0aXRpb25cbiAgICAgKi9cbiAgICByZXR1cm4gZmVuLnNwbGl0KCcgJykuc2xpY2UoMCwgNCkuam9pbignICcpO1xufVxuZXhwb3J0IGNsYXNzIENoZXNzIHtcbiAgICBfYm9hcmQgPSBuZXcgQXJyYXkoMTI4KTtcbiAgICBfdHVybiA9IFdISVRFO1xuICAgIF9oZWFkZXIgPSB7fTtcbiAgICBfa2luZ3MgPSB7IHc6IEVNUFRZLCBiOiBFTVBUWSB9O1xuICAgIF9lcFNxdWFyZSA9IC0xO1xuICAgIF9oYWxmTW92ZXMgPSAwO1xuICAgIF9tb3ZlTnVtYmVyID0gMDtcbiAgICBfaGlzdG9yeSA9IFtdO1xuICAgIF9jb21tZW50cyA9IHt9O1xuICAgIF9jYXN0bGluZyA9IHsgdzogMCwgYjogMCB9O1xuICAgIF9wb3NpdGlvbkNvdW50cyA9IHt9O1xuICAgIGNvbnN0cnVjdG9yKGZlbiA9IERFRkFVTFRfUE9TSVRJT04pIHtcbiAgICAgICAgdGhpcy5sb2FkKGZlbik7XG4gICAgfVxuICAgIGNsZWFyKHsgcHJlc2VydmVIZWFkZXJzID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2JvYXJkID0gbmV3IEFycmF5KDEyOCk7XG4gICAgICAgIHRoaXMuX2tpbmdzID0geyB3OiBFTVBUWSwgYjogRU1QVFkgfTtcbiAgICAgICAgdGhpcy5fdHVybiA9IFdISVRFO1xuICAgICAgICB0aGlzLl9jYXN0bGluZyA9IHsgdzogMCwgYjogMCB9O1xuICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IEVNUFRZO1xuICAgICAgICB0aGlzLl9oYWxmTW92ZXMgPSAwO1xuICAgICAgICB0aGlzLl9tb3ZlTnVtYmVyID0gMTtcbiAgICAgICAgdGhpcy5faGlzdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLl9jb21tZW50cyA9IHt9O1xuICAgICAgICB0aGlzLl9oZWFkZXIgPSBwcmVzZXJ2ZUhlYWRlcnMgPyB0aGlzLl9oZWFkZXIgOiB7fTtcbiAgICAgICAgLypcbiAgICAgICAgICogRGVsZXRlIHRoZSBTZXRVcCBhbmQgRkVOIGhlYWRlcnMgKGlmIHByZXNlcnZlZCksIHRoZSBib2FyZCBpcyBlbXB0eSBhbmRcbiAgICAgICAgICogdGhlc2UgaGVhZGVycyBkb24ndCBtYWtlIHNlbnNlIGluIHRoaXMgc3RhdGUuIFRoZXknbGwgZ2V0IGFkZGVkIGxhdGVyXG4gICAgICAgICAqIHZpYSAubG9hZCgpIG9yIC5wdXQoKVxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlclsnU2V0VXAnXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlclsnRkVOJ107XG4gICAgICAgIC8qXG4gICAgICAgICAqIEluc3RhbnRpYXRlIGEgcHJveHkgdGhhdCBrZWVwcyB0cmFjayBvZiBwb3NpdGlvbiBvY2N1cnJlbmNlIGNvdW50cyBmb3IgdGhlIHB1cnBvc2VcbiAgICAgICAgICogb2YgcmVwZXRpdGlvbiBjaGVja2luZy4gVGhlIGdldHRlciBhbmQgc2V0dGVyIG1ldGhvZHMgYXV0b21hdGljYWxseSBoYW5kbGUgdHJpbW1pbmdcbiAgICAgICAgICogaXJyZWxldmVudCBpbmZvcm1hdGlvbiBmcm9tIHRoZSBmZW4sIGluaXRpYWxpc2luZyBuZXcgcG9zaXRpb25zLCBhbmQgcmVtb3Zpbmcgb2xkXG4gICAgICAgICAqIHBvc2l0aW9ucyBmcm9tIHRoZSByZWNvcmQgaWYgdGhlaXIgY291bnRzIGFyZSByZWR1Y2VkIHRvIDAuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wb3NpdGlvbkNvdW50cyA9IG5ldyBQcm94eSh7fSwge1xuICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwb3NpdGlvbikgPT4gcG9zaXRpb24gPT09ICdsZW5ndGgnXG4gICAgICAgICAgICAgICAgPyBPYmplY3Qua2V5cyh0YXJnZXQpLmxlbmd0aCAvLyBsZW5ndGggZm9yIHVuaXQgdGVzdGluZ1xuICAgICAgICAgICAgICAgIDogdGFyZ2V0Py5bdHJpbUZlbihwb3NpdGlvbildIHx8IDAsXG4gICAgICAgICAgICBzZXQ6ICh0YXJnZXQsIHBvc2l0aW9uLCBjb3VudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRGZW4gPSB0cmltRmVuKHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRbdHJpbW1lZEZlbl07XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbdHJpbW1lZEZlbl0gPSBjb3VudDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW1vdmVIZWFkZXIoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgaW4gdGhpcy5faGVhZGVyKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5faGVhZGVyW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgbG9hZChmZW4sIHsgc2tpcFZhbGlkYXRpb24gPSBmYWxzZSwgcHJlc2VydmVIZWFkZXJzID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIGxldCB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKTtcbiAgICAgICAgLy8gYXBwZW5kIGNvbW1vbmx5IG9taXR0ZWQgZmVuIHRva2Vuc1xuICAgICAgICBpZiAodG9rZW5zLmxlbmd0aCA+PSAyICYmIHRva2Vucy5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICBjb25zdCBhZGp1c3RtZW50cyA9IFsnLScsICctJywgJzAnLCAnMSddO1xuICAgICAgICAgICAgZmVuID0gdG9rZW5zLmNvbmNhdChhZGp1c3RtZW50cy5zbGljZSgtKDYgLSB0b2tlbnMubGVuZ3RoKSkpLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgICAgICB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKTtcbiAgICAgICAgaWYgKCFza2lwVmFsaWRhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgeyBvaywgZXJyb3IgfSA9IHZhbGlkYXRlRmVuKGZlbik7XG4gICAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRva2Vuc1swXTtcbiAgICAgICAgbGV0IHNxdWFyZSA9IDA7XG4gICAgICAgIHRoaXMuY2xlYXIoeyBwcmVzZXJ2ZUhlYWRlcnMgfSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBpZWNlID0gcG9zaXRpb24uY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYgKHBpZWNlID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICBzcXVhcmUgKz0gODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGlnaXQocGllY2UpKSB7XG4gICAgICAgICAgICAgICAgc3F1YXJlICs9IHBhcnNlSW50KHBpZWNlLCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IHBpZWNlIDwgJ2EnID8gV0hJVEUgOiBCTEFDSztcbiAgICAgICAgICAgICAgICB0aGlzLl9wdXQoeyB0eXBlOiBwaWVjZS50b0xvd2VyQ2FzZSgpLCBjb2xvciB9LCBhbGdlYnJhaWMoc3F1YXJlKSk7XG4gICAgICAgICAgICAgICAgc3F1YXJlKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdHVybiA9IHRva2Vuc1sxXTtcbiAgICAgICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdLJykgPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcudyB8PSBCSVRTLktTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ1EnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy53IHw9IEJJVFMuUVNJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignaycpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLmIgfD0gQklUUy5LU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdxJykgPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcuYiB8PSBCSVRTLlFTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IHRva2Vuc1szXSA9PT0gJy0nID8gRU1QVFkgOiBPeDg4W3Rva2Vuc1szXV07XG4gICAgICAgIHRoaXMuX2hhbGZNb3ZlcyA9IHBhcnNlSW50KHRva2Vuc1s0XSwgMTApO1xuICAgICAgICB0aGlzLl9tb3ZlTnVtYmVyID0gcGFyc2VJbnQodG9rZW5zWzVdLCAxMCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNldHVwKGZlbik7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uQ291bnRzW2Zlbl0rKztcbiAgICB9XG4gICAgZmVuKCkge1xuICAgICAgICBsZXQgZW1wdHkgPSAwO1xuICAgICAgICBsZXQgZmVuID0gJyc7XG4gICAgICAgIGZvciAobGV0IGkgPSBPeDg4LmE4OyBpIDw9IE94ODguaDE7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW2ldKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVtcHR5ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmZW4gKz0gZW1wdHk7XG4gICAgICAgICAgICAgICAgICAgIGVtcHR5ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjb2xvciwgdHlwZTogcGllY2UgfSA9IHRoaXMuX2JvYXJkW2ldO1xuICAgICAgICAgICAgICAgIGZlbiArPSBjb2xvciA9PT0gV0hJVEUgPyBwaWVjZS50b1VwcGVyQ2FzZSgpIDogcGllY2UudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVtcHR5Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGkgKyAxKSAmIDB4ODgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZW1wdHkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZlbiArPSBlbXB0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IE94ODguaDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmVuICs9ICcvJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW1wdHkgPSAwO1xuICAgICAgICAgICAgICAgIGkgKz0gODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY2FzdGxpbmcgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW1dISVRFXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICBjYXN0bGluZyArPSAnSyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW1dISVRFXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICBjYXN0bGluZyArPSAnUSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW0JMQUNLXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICBjYXN0bGluZyArPSAnayc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW0JMQUNLXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICBjYXN0bGluZyArPSAncSc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG8gd2UgaGF2ZSBhbiBlbXB0eSBjYXN0bGluZyBmbGFnP1xuICAgICAgICBjYXN0bGluZyA9IGNhc3RsaW5nIHx8ICctJztcbiAgICAgICAgbGV0IGVwU3F1YXJlID0gJy0nO1xuICAgICAgICAvKlxuICAgICAgICAgKiBvbmx5IHByaW50IHRoZSBlcCBzcXVhcmUgaWYgZW4gcGFzc2FudCBpcyBhIHZhbGlkIG1vdmUgKHBhd24gaXMgcHJlc2VudFxuICAgICAgICAgKiBhbmQgZXAgY2FwdHVyZSBpcyBub3QgcGlubmVkKVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHRoaXMuX2VwU3F1YXJlICE9PSBFTVBUWSkge1xuICAgICAgICAgICAgY29uc3QgYmlnUGF3blNxdWFyZSA9IHRoaXMuX2VwU3F1YXJlICsgKHRoaXMuX3R1cm4gPT09IFdISVRFID8gMTYgOiAtMTYpO1xuICAgICAgICAgICAgY29uc3Qgc3F1YXJlcyA9IFtiaWdQYXduU3F1YXJlICsgMSwgYmlnUGF3blNxdWFyZSAtIDFdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBzcXVhcmUgb2Ygc3F1YXJlcykge1xuICAgICAgICAgICAgICAgIC8vIGlzIHRoZSBzcXVhcmUgb2ZmIHRoZSBib2FyZD9cbiAgICAgICAgICAgICAgICBpZiAoc3F1YXJlICYgMHg4OCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLl90dXJuO1xuICAgICAgICAgICAgICAgIC8vIGlzIHRoZXJlIGEgcGF3biB0aGF0IGNhbiBjYXB0dXJlIHRoZSBlcFNxdWFyZT9cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbc3F1YXJlXT8uY29sb3IgPT09IGNvbG9yICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JvYXJkW3NxdWFyZV0/LnR5cGUgPT09IFBBV04pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBhd24gbWFrZXMgYW4gZXAgY2FwdHVyZSwgZG9lcyBpdCBsZWF2ZSBpdCdzIGtpbmcgaW4gY2hlY2s/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21ha2VNb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogc3F1YXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHRoaXMuX2VwU3F1YXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGllY2U6IFBBV04sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlZDogUEFXTixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdzOiBCSVRTLkVQX0NBUFRVUkUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xlZ2FsID0gIXRoaXMuX2lzS2luZ0F0dGFja2VkKGNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5kb01vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZXAgaXMgbGVnYWwsIGJyZWFrIGFuZCBzZXQgdGhlIGVwIHNxdWFyZSBpbiB0aGUgRkVOIG91dHB1dFxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNMZWdhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXBTcXVhcmUgPSBhbGdlYnJhaWModGhpcy5fZXBTcXVhcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGZlbixcbiAgICAgICAgICAgIHRoaXMuX3R1cm4sXG4gICAgICAgICAgICBjYXN0bGluZyxcbiAgICAgICAgICAgIGVwU3F1YXJlLFxuICAgICAgICAgICAgdGhpcy5faGFsZk1vdmVzLFxuICAgICAgICAgICAgdGhpcy5fbW92ZU51bWJlcixcbiAgICAgICAgXS5qb2luKCcgJyk7XG4gICAgfVxuICAgIC8qXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGluaXRpYWwgYm9hcmQgc2V0dXAgaXMgY2hhbmdlZCB3aXRoIHB1dCgpIG9yIHJlbW92ZSgpLlxuICAgICAqIG1vZGlmaWVzIHRoZSBTZXRVcCBhbmQgRkVOIHByb3BlcnRpZXMgb2YgdGhlIGhlYWRlciBvYmplY3QuIElmIHRoZSBGRU5cbiAgICAgKiBpcyBlcXVhbCB0byB0aGUgZGVmYXVsdCBwb3NpdGlvbiwgdGhlIFNldFVwIGFuZCBGRU4gYXJlIGRlbGV0ZWQgdGhlIHNldHVwXG4gICAgICogaXMgb25seSB1cGRhdGVkIGlmIGhpc3RvcnkubGVuZ3RoIGlzIHplcm8sIGllIG1vdmVzIGhhdmVuJ3QgYmVlbiBtYWRlLlxuICAgICAqL1xuICAgIF91cGRhdGVTZXR1cChmZW4pIHtcbiAgICAgICAgaWYgKHRoaXMuX2hpc3RvcnkubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKGZlbiAhPT0gREVGQVVMVF9QT1NJVElPTikge1xuICAgICAgICAgICAgdGhpcy5faGVhZGVyWydTZXRVcCddID0gJzEnO1xuICAgICAgICAgICAgdGhpcy5faGVhZGVyWydGRU4nXSA9IGZlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJbJ1NldFVwJ107XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5faGVhZGVyWydGRU4nXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5sb2FkKERFRkFVTFRfUE9TSVRJT04pO1xuICAgIH1cbiAgICBnZXQoc3F1YXJlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib2FyZFtPeDg4W3NxdWFyZV1dIHx8IGZhbHNlO1xuICAgIH1cbiAgICBwdXQoeyB0eXBlLCBjb2xvciB9LCBzcXVhcmUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3B1dCh7IHR5cGUsIGNvbG9yIH0sIHNxdWFyZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNhc3RsaW5nUmlnaHRzKCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVFblBhc3NhbnRTcXVhcmUoKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNldHVwKHRoaXMuZmVuKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfcHV0KHsgdHlwZSwgY29sb3IgfSwgc3F1YXJlKSB7XG4gICAgICAgIC8vIGNoZWNrIGZvciBwaWVjZVxuICAgICAgICBpZiAoU1lNQk9MUy5pbmRleE9mKHR5cGUudG9Mb3dlckNhc2UoKSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgZm9yIHZhbGlkIHNxdWFyZVxuICAgICAgICBpZiAoIShzcXVhcmUgaW4gT3g4OCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcSA9IE94ODhbc3F1YXJlXTtcbiAgICAgICAgLy8gZG9uJ3QgbGV0IHRoZSB1c2VyIHBsYWNlIG1vcmUgdGhhbiBvbmUga2luZ1xuICAgICAgICBpZiAodHlwZSA9PSBLSU5HICYmXG4gICAgICAgICAgICAhKHRoaXMuX2tpbmdzW2NvbG9yXSA9PSBFTVBUWSB8fCB0aGlzLl9raW5nc1tjb2xvcl0gPT0gc3EpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VycmVudFBpZWNlT25TcXVhcmUgPSB0aGlzLl9ib2FyZFtzcV07XG4gICAgICAgIC8vIGlmIG9uZSBvZiB0aGUga2luZ3Mgd2lsbCBiZSByZXBsYWNlZCBieSB0aGUgcGllY2UgZnJvbSBhcmdzLCBzZXQgdGhlIGBfa2luZ3NgIHJlc3BlY3RpdmUgZW50cnkgdG8gYEVNUFRZYFxuICAgICAgICBpZiAoY3VycmVudFBpZWNlT25TcXVhcmUgJiYgY3VycmVudFBpZWNlT25TcXVhcmUudHlwZSA9PT0gS0lORykge1xuICAgICAgICAgICAgdGhpcy5fa2luZ3NbY3VycmVudFBpZWNlT25TcXVhcmUuY29sb3JdID0gRU1QVFk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYm9hcmRbc3FdID0geyB0eXBlOiB0eXBlLCBjb2xvcjogY29sb3IgfTtcbiAgICAgICAgaWYgKHR5cGUgPT09IEtJTkcpIHtcbiAgICAgICAgICAgIHRoaXMuX2tpbmdzW2NvbG9yXSA9IHNxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZW1vdmUoc3F1YXJlKSB7XG4gICAgICAgIGNvbnN0IHBpZWNlID0gdGhpcy5nZXQoc3F1YXJlKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW094ODhbc3F1YXJlXV07XG4gICAgICAgIGlmIChwaWVjZSAmJiBwaWVjZS50eXBlID09PSBLSU5HKSB7XG4gICAgICAgICAgICB0aGlzLl9raW5nc1twaWVjZS5jb2xvcl0gPSBFTVBUWTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVDYXN0bGluZ1JpZ2h0cygpO1xuICAgICAgICB0aGlzLl91cGRhdGVFblBhc3NhbnRTcXVhcmUoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2V0dXAodGhpcy5mZW4oKSk7XG4gICAgICAgIHJldHVybiBwaWVjZTtcbiAgICB9XG4gICAgX3VwZGF0ZUNhc3RsaW5nUmlnaHRzKCkge1xuICAgICAgICBjb25zdCB3aGl0ZUtpbmdJblBsYWNlID0gdGhpcy5fYm9hcmRbT3g4OC5lMV0/LnR5cGUgPT09IEtJTkcgJiZcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguZTFdPy5jb2xvciA9PT0gV0hJVEU7XG4gICAgICAgIGNvbnN0IGJsYWNrS2luZ0luUGxhY2UgPSB0aGlzLl9ib2FyZFtPeDg4LmU4XT8udHlwZSA9PT0gS0lORyAmJlxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5lOF0/LmNvbG9yID09PSBCTEFDSztcbiAgICAgICAgaWYgKCF3aGl0ZUtpbmdJblBsYWNlIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmExXT8udHlwZSAhPT0gUk9PSyB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5hMV0/LmNvbG9yICE9PSBXSElURSkge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcudyAmPSB+QklUUy5RU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF3aGl0ZUtpbmdJblBsYWNlIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmgxXT8udHlwZSAhPT0gUk9PSyB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5oMV0/LmNvbG9yICE9PSBXSElURSkge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcudyAmPSB+QklUUy5LU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFibGFja0tpbmdJblBsYWNlIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmE4XT8udHlwZSAhPT0gUk9PSyB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5hOF0/LmNvbG9yICE9PSBCTEFDSykge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcuYiAmPSB+QklUUy5RU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFibGFja0tpbmdJblBsYWNlIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4Lmg4XT8udHlwZSAhPT0gUk9PSyB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5oOF0/LmNvbG9yICE9PSBCTEFDSykge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcuYiAmPSB+QklUUy5LU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3VwZGF0ZUVuUGFzc2FudFNxdWFyZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VwU3F1YXJlID09PSBFTVBUWSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXJ0U3F1YXJlID0gdGhpcy5fZXBTcXVhcmUgKyAodGhpcy5fdHVybiA9PT0gV0hJVEUgPyAtMTYgOiAxNik7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTcXVhcmUgPSB0aGlzLl9lcFNxdWFyZSArICh0aGlzLl90dXJuID09PSBXSElURSA/IDE2IDogLTE2KTtcbiAgICAgICAgY29uc3QgYXR0YWNrZXJzID0gW2N1cnJlbnRTcXVhcmUgKyAxLCBjdXJyZW50U3F1YXJlIC0gMV07XG4gICAgICAgIGlmICh0aGlzLl9ib2FyZFtzdGFydFNxdWFyZV0gIT09IG51bGwgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW3RoaXMuX2VwU3F1YXJlXSAhPT0gbnVsbCB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbY3VycmVudFNxdWFyZV0/LmNvbG9yICE9PSBzd2FwQ29sb3IodGhpcy5fdHVybikgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW2N1cnJlbnRTcXVhcmVdPy50eXBlICE9PSBQQVdOKSB7XG4gICAgICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IEVNUFRZO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNhbkNhcHR1cmUgPSAoc3F1YXJlKSA9PiAhKHNxdWFyZSAmIDB4ODgpICYmXG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtzcXVhcmVdPy5jb2xvciA9PT0gdGhpcy5fdHVybiAmJlxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbc3F1YXJlXT8udHlwZSA9PT0gUEFXTjtcbiAgICAgICAgaWYgKCFhdHRhY2tlcnMuc29tZShjYW5DYXB0dXJlKSkge1xuICAgICAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSBFTVBUWTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfYXR0YWNrZWQoY29sb3IsIHNxdWFyZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gT3g4OC5hODsgaSA8PSBPeDg4LmgxOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGRpZCB3ZSBydW4gb2ZmIHRoZSBlbmQgb2YgdGhlIGJvYXJkXG4gICAgICAgICAgICBpZiAoaSAmIDB4ODgpIHtcbiAgICAgICAgICAgICAgICBpICs9IDc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBlbXB0eSBzcXVhcmUgb3Igd3JvbmcgY29sb3JcbiAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFtpXSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX2JvYXJkW2ldLmNvbG9yICE9PSBjb2xvcikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGllY2UgPSB0aGlzLl9ib2FyZFtpXTtcbiAgICAgICAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSBpIC0gc3F1YXJlO1xuICAgICAgICAgICAgLy8gc2tpcCAtIHRvL2Zyb20gc3F1YXJlIGFyZSB0aGUgc2FtZVxuICAgICAgICAgICAgaWYgKGRpZmZlcmVuY2UgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZGlmZmVyZW5jZSArIDExOTtcbiAgICAgICAgICAgIGlmIChBVFRBQ0tTW2luZGV4XSAmIFBJRUNFX01BU0tTW3BpZWNlLnR5cGVdKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IFBBV04pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZmZlcmVuY2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGllY2UuY29sb3IgPT09IFdISVRFKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBpZWNlLmNvbG9yID09PSBCTEFDSylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBpZWNlIGlzIGEga25pZ2h0IG9yIGEga2luZ1xuICAgICAgICAgICAgICAgIGlmIChwaWVjZS50eXBlID09PSAnbicgfHwgcGllY2UudHlwZSA9PT0gJ2snKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBSQVlTW2luZGV4XTtcbiAgICAgICAgICAgICAgICBsZXQgaiA9IGkgKyBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaiAhPT0gc3F1YXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFtqXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGogKz0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgX2lzS2luZ0F0dGFja2VkKGNvbG9yKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IHRoaXMuX2tpbmdzW2NvbG9yXTtcbiAgICAgICAgcmV0dXJuIHNxdWFyZSA9PT0gLTEgPyBmYWxzZSA6IHRoaXMuX2F0dGFja2VkKHN3YXBDb2xvcihjb2xvciksIHNxdWFyZSk7XG4gICAgfVxuICAgIGlzQXR0YWNrZWQoc3F1YXJlLCBhdHRhY2tlZEJ5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdHRhY2tlZChhdHRhY2tlZEJ5LCBPeDg4W3NxdWFyZV0pO1xuICAgIH1cbiAgICBpc0NoZWNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNLaW5nQXR0YWNrZWQodGhpcy5fdHVybik7XG4gICAgfVxuICAgIGluQ2hlY2soKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ2hlY2soKTtcbiAgICB9XG4gICAgaXNDaGVja21hdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ2hlY2soKSAmJiB0aGlzLl9tb3ZlcygpLmxlbmd0aCA9PT0gMDtcbiAgICB9XG4gICAgaXNTdGFsZW1hdGUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0NoZWNrKCkgJiYgdGhpcy5fbW92ZXMoKS5sZW5ndGggPT09IDA7XG4gICAgfVxuICAgIGlzSW5zdWZmaWNpZW50TWF0ZXJpYWwoKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIGsuYi4gdnMgay5iLiAob2Ygb3Bwb3NpdGUgY29sb3JzKSB3aXRoIG1hdGUgaW4gMTpcbiAgICAgICAgICogOC84LzgvOC8xYjYvOC9CMWs1L0s3IGIgLSAtIDAgMVxuICAgICAgICAgKlxuICAgICAgICAgKiBrLmIuIHZzIGsubi4gd2l0aCBtYXRlIGluIDE6XG4gICAgICAgICAqIDgvOC84LzgvMW42LzgvQjcvSzFrNSBiIC0gLSAyIDFcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IHtcbiAgICAgICAgICAgIGI6IDAsXG4gICAgICAgICAgICBuOiAwLFxuICAgICAgICAgICAgcjogMCxcbiAgICAgICAgICAgIHE6IDAsXG4gICAgICAgICAgICBrOiAwLFxuICAgICAgICAgICAgcDogMCxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgYmlzaG9wcyA9IFtdO1xuICAgICAgICBsZXQgbnVtUGllY2VzID0gMDtcbiAgICAgICAgbGV0IHNxdWFyZUNvbG9yID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IE94ODguYTg7IGkgPD0gT3g4OC5oMTsgaSsrKSB7XG4gICAgICAgICAgICBzcXVhcmVDb2xvciA9IChzcXVhcmVDb2xvciArIDEpICUgMjtcbiAgICAgICAgICAgIGlmIChpICYgMHg4OCkge1xuICAgICAgICAgICAgICAgIGkgKz0gNztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBpZWNlID0gdGhpcy5fYm9hcmRbaV07XG4gICAgICAgICAgICBpZiAocGllY2UpIHtcbiAgICAgICAgICAgICAgICBwaWVjZXNbcGllY2UudHlwZV0gPSBwaWVjZS50eXBlIGluIHBpZWNlcyA/IHBpZWNlc1twaWVjZS50eXBlXSArIDEgOiAxO1xuICAgICAgICAgICAgICAgIGlmIChwaWVjZS50eXBlID09PSBCSVNIT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgYmlzaG9wcy5wdXNoKHNxdWFyZUNvbG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbnVtUGllY2VzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gayB2cy4ga1xuICAgICAgICBpZiAobnVtUGllY2VzID09PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgLy8gayB2cy4ga24gLi4uLiBvciAuLi4uIGsgdnMuIGtiXG4gICAgICAgIG51bVBpZWNlcyA9PT0gMyAmJlxuICAgICAgICAgICAgKHBpZWNlc1tCSVNIT1BdID09PSAxIHx8IHBpZWNlc1tLTklHSFRdID09PSAxKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobnVtUGllY2VzID09PSBwaWVjZXNbQklTSE9QXSArIDIpIHtcbiAgICAgICAgICAgIC8vIGtiIHZzLiBrYiB3aGVyZSBhbnkgbnVtYmVyIG9mIGJpc2hvcHMgYXJlIGFsbCBvbiB0aGUgc2FtZSBjb2xvclxuICAgICAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgICAgICBjb25zdCBsZW4gPSBiaXNob3BzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdW0gKz0gYmlzaG9wc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdW0gPT09IDAgfHwgc3VtID09PSBsZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9nZXRSZXBldGl0aW9uQ291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbkNvdW50c1t0aGlzLmZlbigpXTtcbiAgICB9XG4gICAgaXNUaHJlZWZvbGRSZXBldGl0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0UmVwZXRpdGlvbkNvdW50KCkgPj0gMztcbiAgICB9XG4gICAgaXNEcmF3KCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2hhbGZNb3ZlcyA+PSAxMDAgfHwgLy8gNTAgbW92ZXMgcGVyIHNpZGUgPSAxMDAgaGFsZiBtb3Zlc1xuICAgICAgICAgICAgdGhpcy5pc1N0YWxlbWF0ZSgpIHx8XG4gICAgICAgICAgICB0aGlzLmlzSW5zdWZmaWNpZW50TWF0ZXJpYWwoKSB8fFxuICAgICAgICAgICAgdGhpcy5pc1RocmVlZm9sZFJlcGV0aXRpb24oKSk7XG4gICAgfVxuICAgIGlzR2FtZU92ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ2hlY2ttYXRlKCkgfHwgdGhpcy5pc1N0YWxlbWF0ZSgpIHx8IHRoaXMuaXNEcmF3KCk7XG4gICAgfVxuICAgIG1vdmVzKHsgdmVyYm9zZSA9IGZhbHNlLCBzcXVhcmUgPSB1bmRlZmluZWQsIHBpZWNlID0gdW5kZWZpbmVkLCB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgbW92ZXMgPSB0aGlzLl9tb3Zlcyh7IHNxdWFyZSwgcGllY2UgfSk7XG4gICAgICAgIGlmICh2ZXJib3NlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW92ZXMubWFwKChtb3ZlKSA9PiB0aGlzLl9tYWtlUHJldHR5KG1vdmUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtb3Zlcy5tYXAoKG1vdmUpID0+IHRoaXMuX21vdmVUb1Nhbihtb3ZlLCBtb3ZlcykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9tb3Zlcyh7IGxlZ2FsID0gdHJ1ZSwgcGllY2UgPSB1bmRlZmluZWQsIHNxdWFyZSA9IHVuZGVmaW5lZCwgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGZvclNxdWFyZSA9IHNxdWFyZSA/IHNxdWFyZS50b0xvd2VyQ2FzZSgpIDogdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBmb3JQaWVjZSA9IHBpZWNlPy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBtb3ZlcyA9IFtdO1xuICAgICAgICBjb25zdCB1cyA9IHRoaXMuX3R1cm47XG4gICAgICAgIGNvbnN0IHRoZW0gPSBzd2FwQ29sb3IodXMpO1xuICAgICAgICBsZXQgZmlyc3RTcXVhcmUgPSBPeDg4LmE4O1xuICAgICAgICBsZXQgbGFzdFNxdWFyZSA9IE94ODguaDE7XG4gICAgICAgIGxldCBzaW5nbGVTcXVhcmUgPSBmYWxzZTtcbiAgICAgICAgLy8gYXJlIHdlIGdlbmVyYXRpbmcgbW92ZXMgZm9yIGEgc2luZ2xlIHNxdWFyZT9cbiAgICAgICAgaWYgKGZvclNxdWFyZSkge1xuICAgICAgICAgICAgLy8gaWxsZWdhbCBzcXVhcmUsIHJldHVybiBlbXB0eSBtb3Zlc1xuICAgICAgICAgICAgaWYgKCEoZm9yU3F1YXJlIGluIE94ODgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlyc3RTcXVhcmUgPSBsYXN0U3F1YXJlID0gT3g4OFtmb3JTcXVhcmVdO1xuICAgICAgICAgICAgICAgIHNpbmdsZVNxdWFyZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgZnJvbSA9IGZpcnN0U3F1YXJlOyBmcm9tIDw9IGxhc3RTcXVhcmU7IGZyb20rKykge1xuICAgICAgICAgICAgLy8gZGlkIHdlIHJ1biBvZmYgdGhlIGVuZCBvZiB0aGUgYm9hcmRcbiAgICAgICAgICAgIGlmIChmcm9tICYgMHg4OCkge1xuICAgICAgICAgICAgICAgIGZyb20gKz0gNztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVtcHR5IHNxdWFyZSBvciBvcHBvbmVudCwgc2tpcFxuICAgICAgICAgICAgaWYgKCF0aGlzLl9ib2FyZFtmcm9tXSB8fCB0aGlzLl9ib2FyZFtmcm9tXS5jb2xvciA9PT0gdGhlbSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLl9ib2FyZFtmcm9tXTtcbiAgICAgICAgICAgIGxldCB0bztcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBQQVdOKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvclBpZWNlICYmIGZvclBpZWNlICE9PSB0eXBlKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBzaW5nbGUgc3F1YXJlLCBub24tY2FwdHVyaW5nXG4gICAgICAgICAgICAgICAgdG8gPSBmcm9tICsgUEFXTl9PRkZTRVRTW3VzXVswXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2JvYXJkW3RvXSkge1xuICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgZnJvbSwgdG8sIFBBV04pO1xuICAgICAgICAgICAgICAgICAgICAvLyBkb3VibGUgc3F1YXJlXG4gICAgICAgICAgICAgICAgICAgIHRvID0gZnJvbSArIFBBV05fT0ZGU0VUU1t1c11bMV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChTRUNPTkRfUkFOS1t1c10gPT09IHJhbmsoZnJvbSkgJiYgIXRoaXMuX2JvYXJkW3RvXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIGZyb20sIHRvLCBQQVdOLCB1bmRlZmluZWQsIEJJVFMuQklHX1BBV04pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHBhd24gY2FwdHVyZXNcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMjsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB0byA9IGZyb20gKyBQQVdOX09GRlNFVFNbdXNdW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG8gJiAweDg4KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFt0b10/LmNvbG9yID09PSB0aGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgZnJvbSwgdG8sIFBBV04sIHRoaXMuX2JvYXJkW3RvXS50eXBlLCBCSVRTLkNBUFRVUkUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRvID09PSB0aGlzLl9lcFNxdWFyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIGZyb20sIHRvLCBQQVdOLCBQQVdOLCBCSVRTLkVQX0NBUFRVUkUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvclBpZWNlICYmIGZvclBpZWNlICE9PSB0eXBlKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gUElFQ0VfT0ZGU0VUU1t0eXBlXS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBQSUVDRV9PRkZTRVRTW3R5cGVdW2pdO1xuICAgICAgICAgICAgICAgICAgICB0byA9IGZyb207XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0byArPSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG8gJiAweDg4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ib2FyZFt0b10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgZnJvbSwgdG8sIHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3duIGNvbG9yLCBzdG9wIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbdG9dLmNvbG9yID09PSB1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIGZyb20sIHRvLCB0eXBlLCB0aGlzLl9ib2FyZFt0b10udHlwZSwgQklUUy5DQVBUVVJFKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGJyZWFrLCBpZiBrbmlnaHQgb3Iga2luZyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IEtOSUdIVCB8fCB0eXBlID09PSBLSU5HKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIGNoZWNrIGZvciBjYXN0bGluZyBpZiB3ZSdyZTpcbiAgICAgICAgICogICBhKSBnZW5lcmF0aW5nIGFsbCBtb3Zlcywgb3JcbiAgICAgICAgICogICBiKSBkb2luZyBzaW5nbGUgc3F1YXJlIG1vdmUgZ2VuZXJhdGlvbiBvbiB0aGUga2luZydzIHNxdWFyZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGZvclBpZWNlID09PSB1bmRlZmluZWQgfHwgZm9yUGllY2UgPT09IEtJTkcpIHtcbiAgICAgICAgICAgIGlmICghc2luZ2xlU3F1YXJlIHx8IGxhc3RTcXVhcmUgPT09IHRoaXMuX2tpbmdzW3VzXSkge1xuICAgICAgICAgICAgICAgIC8vIGtpbmctc2lkZSBjYXN0bGluZ1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1t1c10gJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ0Zyb20gPSB0aGlzLl9raW5nc1t1c107XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nVG8gPSBjYXN0bGluZ0Zyb20gKyAyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbSArIDFdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYm9hcmRbY2FzdGxpbmdUb10gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9hdHRhY2tlZCh0aGVtLCB0aGlzLl9raW5nc1t1c10pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdGcm9tICsgMSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9hdHRhY2tlZCh0aGVtLCBjYXN0bGluZ1RvKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIHRoaXMuX2tpbmdzW3VzXSwgY2FzdGxpbmdUbywgS0lORywgdW5kZWZpbmVkLCBCSVRTLktTSURFX0NBU1RMRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcXVlZW4tc2lkZSBjYXN0bGluZ1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1t1c10gJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ0Zyb20gPSB0aGlzLl9raW5nc1t1c107XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nVG8gPSBjYXN0bGluZ0Zyb20gLSAyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbSAtIDFdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tIC0gMl0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb20gLSAzXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2F0dGFja2VkKHRoZW0sIHRoaXMuX2tpbmdzW3VzXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9hdHRhY2tlZCh0aGVtLCBjYXN0bGluZ0Zyb20gLSAxKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2F0dGFja2VkKHRoZW0sIGNhc3RsaW5nVG8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgdGhpcy5fa2luZ3NbdXNdLCBjYXN0bGluZ1RvLCBLSU5HLCB1bmRlZmluZWQsIEJJVFMuUVNJREVfQ0FTVExFKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiByZXR1cm4gYWxsIHBzZXVkby1sZWdhbCBtb3ZlcyAodGhpcyBpbmNsdWRlcyBtb3ZlcyB0aGF0IGFsbG93IHRoZSBraW5nXG4gICAgICAgICAqIHRvIGJlIGNhcHR1cmVkKVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFsZWdhbCB8fCB0aGlzLl9raW5nc1t1c10gPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbW92ZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZmlsdGVyIG91dCBpbGxlZ2FsIG1vdmVzXG4gICAgICAgIGNvbnN0IGxlZ2FsTW92ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3Zlc1tpXSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzS2luZ0F0dGFja2VkKHVzKSkge1xuICAgICAgICAgICAgICAgIGxlZ2FsTW92ZXMucHVzaChtb3Zlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91bmRvTW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZWdhbE1vdmVzO1xuICAgIH1cbiAgICBtb3ZlKG1vdmUsIHsgc3RyaWN0ID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoZSBtb3ZlIGZ1bmN0aW9uIGNhbiBiZSBjYWxsZWQgd2l0aCBpbiB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAgICAgICAqXG4gICAgICAgICAqIC5tb3ZlKCdOeGI3JykgICAgICAgPC0gYXJndW1lbnQgaXMgYSBjYXNlLXNlbnNpdGl2ZSBTQU4gc3RyaW5nXG4gICAgICAgICAqXG4gICAgICAgICAqIC5tb3ZlKHsgZnJvbTogJ2g3JywgPC0gYXJndW1lbnQgaXMgYSBtb3ZlIG9iamVjdFxuICAgICAgICAgKiAgICAgICAgIHRvIDonaDgnLFxuICAgICAgICAgKiAgICAgICAgIHByb21vdGlvbjogJ3EnIH0pXG4gICAgICAgICAqXG4gICAgICAgICAqXG4gICAgICAgICAqIEFuIG9wdGlvbmFsIHN0cmljdCBhcmd1bWVudCBtYXkgYmUgc3VwcGxpZWQgdG8gdGVsbCBjaGVzcy5qcyB0b1xuICAgICAgICAgKiBzdHJpY3RseSBmb2xsb3cgdGhlIFNBTiBzcGVjaWZpY2F0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG1vdmVPYmogPSBudWxsO1xuICAgICAgICBpZiAodHlwZW9mIG1vdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBtb3ZlT2JqID0gdGhpcy5fbW92ZUZyb21TYW4obW92ZSwgc3RyaWN0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vdmVzID0gdGhpcy5fbW92ZXMoKTtcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdGhlIHByZXR0eSBtb3ZlIG9iamVjdCB0byBhbiB1Z2x5IG1vdmUgb2JqZWN0XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5mcm9tID09PSBhbGdlYnJhaWMobW92ZXNbaV0uZnJvbSkgJiZcbiAgICAgICAgICAgICAgICAgICAgbW92ZS50byA9PT0gYWxnZWJyYWljKG1vdmVzW2ldLnRvKSAmJlxuICAgICAgICAgICAgICAgICAgICAoISgncHJvbW90aW9uJyBpbiBtb3Zlc1tpXSkgfHwgbW92ZS5wcm9tb3Rpb24gPT09IG1vdmVzW2ldLnByb21vdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZU9iaiA9IG1vdmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gZmFpbGVkIHRvIGZpbmQgbW92ZVxuICAgICAgICBpZiAoIW1vdmVPYmopIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbW92ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbW92ZTogJHttb3ZlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1vdmU6ICR7SlNPTi5zdHJpbmdpZnkobW92ZSl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogbmVlZCB0byBtYWtlIGEgY29weSBvZiBtb3ZlIGJlY2F1c2Ugd2UgY2FuJ3QgZ2VuZXJhdGUgU0FOIGFmdGVyIHRoZSBtb3ZlXG4gICAgICAgICAqIGlzIG1hZGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHByZXR0eU1vdmUgPSB0aGlzLl9tYWtlUHJldHR5KG1vdmVPYmopO1xuICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3ZlT2JqKTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25Db3VudHNbcHJldHR5TW92ZS5hZnRlcl0rKztcbiAgICAgICAgcmV0dXJuIHByZXR0eU1vdmU7XG4gICAgfVxuICAgIF9wdXNoKG1vdmUpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5wdXNoKHtcbiAgICAgICAgICAgIG1vdmUsXG4gICAgICAgICAgICBraW5nczogeyBiOiB0aGlzLl9raW5ncy5iLCB3OiB0aGlzLl9raW5ncy53IH0sXG4gICAgICAgICAgICB0dXJuOiB0aGlzLl90dXJuLFxuICAgICAgICAgICAgY2FzdGxpbmc6IHsgYjogdGhpcy5fY2FzdGxpbmcuYiwgdzogdGhpcy5fY2FzdGxpbmcudyB9LFxuICAgICAgICAgICAgZXBTcXVhcmU6IHRoaXMuX2VwU3F1YXJlLFxuICAgICAgICAgICAgaGFsZk1vdmVzOiB0aGlzLl9oYWxmTW92ZXMsXG4gICAgICAgICAgICBtb3ZlTnVtYmVyOiB0aGlzLl9tb3ZlTnVtYmVyLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX21ha2VNb3ZlKG1vdmUpIHtcbiAgICAgICAgY29uc3QgdXMgPSB0aGlzLl90dXJuO1xuICAgICAgICBjb25zdCB0aGVtID0gc3dhcENvbG9yKHVzKTtcbiAgICAgICAgdGhpcy5fcHVzaChtb3ZlKTtcbiAgICAgICAgdGhpcy5fYm9hcmRbbW92ZS50b10gPSB0aGlzLl9ib2FyZFttb3ZlLmZyb21dO1xuICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbbW92ZS5mcm9tXTtcbiAgICAgICAgLy8gaWYgZXAgY2FwdHVyZSwgcmVtb3ZlIHRoZSBjYXB0dXJlZCBwYXduXG4gICAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdHVybiA9PT0gQkxBQ0spIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbbW92ZS50byAtIDE2XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFttb3ZlLnRvICsgMTZdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHBhd24gcHJvbW90aW9uLCByZXBsYWNlIHdpdGggbmV3IHBpZWNlXG4gICAgICAgIGlmIChtb3ZlLnByb21vdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fYm9hcmRbbW92ZS50b10gPSB7IHR5cGU6IG1vdmUucHJvbW90aW9uLCBjb2xvcjogdXMgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB3ZSBtb3ZlZCB0aGUga2luZ1xuICAgICAgICBpZiAodGhpcy5fYm9hcmRbbW92ZS50b10udHlwZSA9PT0gS0lORykge1xuICAgICAgICAgICAgdGhpcy5fa2luZ3NbdXNdID0gbW92ZS50bztcbiAgICAgICAgICAgIC8vIGlmIHdlIGNhc3RsZWQsIG1vdmUgdGhlIHJvb2sgbmV4dCB0byB0aGUga2luZ1xuICAgICAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nVG8gPSBtb3ZlLnRvIC0gMTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ0Zyb20gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZFtjYXN0bGluZ1RvXSA9IHRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ1RvID0gbW92ZS50byArIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdGcm9tID0gbW92ZS50byAtIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5fYm9hcmRbY2FzdGxpbmdUb10gPSB0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb21dO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb21dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdHVybiBvZmYgY2FzdGxpbmdcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nW3VzXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgbW92ZSBhIHJvb2tcbiAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW3VzXSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IFJPT0tTW3VzXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChtb3ZlLmZyb20gPT09IFJPT0tTW3VzXVtpXS5zcXVhcmUgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmdbdXNdICYgUk9PS1NbdXNdW2ldLmZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmdbdXNdIF49IFJPT0tTW3VzXVtpXS5mbGFnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgY2FwdHVyZSBhIHJvb2tcbiAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW3RoZW1dKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gUk9PS1NbdGhlbV0ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS50byA9PT0gUk9PS1NbdGhlbV1baV0uc3F1YXJlICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nW3RoZW1dICYgUk9PS1NbdGhlbV1baV0uZmxhZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXN0bGluZ1t0aGVtXSBePSBST09LU1t0aGVtXVtpXS5mbGFnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgYmlnIHBhd24gbW92ZSwgdXBkYXRlIHRoZSBlbiBwYXNzYW50IHNxdWFyZVxuICAgICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuQklHX1BBV04pIHtcbiAgICAgICAgICAgIGlmICh1cyA9PT0gQkxBQ0spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IG1vdmUudG8gLSAxNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VwU3F1YXJlID0gbW92ZS50byArIDE2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSBFTVBUWTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXNldCB0aGUgNTAgbW92ZSBjb3VudGVyIGlmIGEgcGF3biBpcyBtb3ZlZCBvciBhIHBpZWNlIGlzIGNhcHR1cmVkXG4gICAgICAgIGlmIChtb3ZlLnBpZWNlID09PSBQQVdOKSB7XG4gICAgICAgICAgICB0aGlzLl9oYWxmTW92ZXMgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5DQVBUVVJFIHwgQklUUy5FUF9DQVBUVVJFKSkge1xuICAgICAgICAgICAgdGhpcy5faGFsZk1vdmVzID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbGZNb3ZlcysrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cyA9PT0gQkxBQ0spIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVOdW1iZXIrKztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90dXJuID0gdGhlbTtcbiAgICB9XG4gICAgdW5kbygpIHtcbiAgICAgICAgY29uc3QgbW92ZSA9IHRoaXMuX3VuZG9Nb3ZlKCk7XG4gICAgICAgIGlmIChtb3ZlKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV0dHlNb3ZlID0gdGhpcy5fbWFrZVByZXR0eShtb3ZlKTtcbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uQ291bnRzW3ByZXR0eU1vdmUuYWZ0ZXJdLS07XG4gICAgICAgICAgICByZXR1cm4gcHJldHR5TW92ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgX3VuZG9Nb3ZlKCkge1xuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLl9oaXN0b3J5LnBvcCgpO1xuICAgICAgICBpZiAob2xkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vdmUgPSBvbGQubW92ZTtcbiAgICAgICAgdGhpcy5fa2luZ3MgPSBvbGQua2luZ3M7XG4gICAgICAgIHRoaXMuX3R1cm4gPSBvbGQudHVybjtcbiAgICAgICAgdGhpcy5fY2FzdGxpbmcgPSBvbGQuY2FzdGxpbmc7XG4gICAgICAgIHRoaXMuX2VwU3F1YXJlID0gb2xkLmVwU3F1YXJlO1xuICAgICAgICB0aGlzLl9oYWxmTW92ZXMgPSBvbGQuaGFsZk1vdmVzO1xuICAgICAgICB0aGlzLl9tb3ZlTnVtYmVyID0gb2xkLm1vdmVOdW1iZXI7XG4gICAgICAgIGNvbnN0IHVzID0gdGhpcy5fdHVybjtcbiAgICAgICAgY29uc3QgdGhlbSA9IHN3YXBDb2xvcih1cyk7XG4gICAgICAgIHRoaXMuX2JvYXJkW21vdmUuZnJvbV0gPSB0aGlzLl9ib2FyZFttb3ZlLnRvXTtcbiAgICAgICAgdGhpcy5fYm9hcmRbbW92ZS5mcm9tXS50eXBlID0gbW92ZS5waWVjZTsgLy8gdG8gdW5kbyBhbnkgcHJvbW90aW9uc1xuICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbbW92ZS50b107XG4gICAgICAgIGlmIChtb3ZlLmNhcHR1cmVkKSB7XG4gICAgICAgICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuRVBfQ0FQVFVSRSkge1xuICAgICAgICAgICAgICAgIC8vIGVuIHBhc3NhbnQgY2FwdHVyZVxuICAgICAgICAgICAgICAgIGxldCBpbmRleDtcbiAgICAgICAgICAgICAgICBpZiAodXMgPT09IEJMQUNLKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbW92ZS50byAtIDE2O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBtb3ZlLnRvICsgMTY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2JvYXJkW2luZGV4XSA9IHsgdHlwZTogUEFXTiwgY29sb3I6IHRoZW0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHJlZ3VsYXIgY2FwdHVyZVxuICAgICAgICAgICAgICAgIHRoaXMuX2JvYXJkW21vdmUudG9dID0geyB0eXBlOiBtb3ZlLmNhcHR1cmVkLCBjb2xvcjogdGhlbSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuS1NJREVfQ0FTVExFIHwgQklUUy5RU0lERV9DQVNUTEUpKSB7XG4gICAgICAgICAgICBsZXQgY2FzdGxpbmdUbywgY2FzdGxpbmdGcm9tO1xuICAgICAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgICAgIGNhc3RsaW5nVG8gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgICAgICAgICBjYXN0bGluZ0Zyb20gPSBtb3ZlLnRvIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhc3RsaW5nVG8gPSBtb3ZlLnRvIC0gMjtcbiAgICAgICAgICAgICAgICBjYXN0bGluZ0Zyb20gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW2Nhc3RsaW5nVG9dID0gdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb21dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb3ZlO1xuICAgIH1cbiAgICBwZ24oeyBuZXdsaW5lID0gJ1xcbicsIG1heFdpZHRoID0gMCwgfSA9IHt9KSB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIHVzaW5nIHRoZSBzcGVjaWZpY2F0aW9uIGZyb20gaHR0cDovL3d3dy5jaGVzc2NsdWIuY29tL2hlbHAvUEdOLXNwZWNcbiAgICAgICAgICogZXhhbXBsZSBmb3IgaHRtbCB1c2FnZTogLnBnbih7IG1heF93aWR0aDogNzIsIG5ld2xpbmVfY2hhcjogXCI8YnIgLz5cIiB9KVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGxldCBoZWFkZXJFeGlzdHMgPSBmYWxzZTtcbiAgICAgICAgLyogYWRkIHRoZSBQR04gaGVhZGVyIGluZm9ybWF0aW9uICovXG4gICAgICAgIGZvciAoY29uc3QgaSBpbiB0aGlzLl9oZWFkZXIpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUT0RPOiBvcmRlciBvZiBlbnVtZXJhdGVkIHByb3BlcnRpZXMgaW4gaGVhZGVyIG9iamVjdCBpcyBub3RcbiAgICAgICAgICAgICAqIGd1YXJhbnRlZWQsIHNlZSBFQ01BLTI2MiBzcGVjIChzZWN0aW9uIDEyLjYuNClcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goJ1snICsgaSArICcgXCInICsgdGhpcy5faGVhZGVyW2ldICsgJ1wiXScgKyBuZXdsaW5lKTtcbiAgICAgICAgICAgIGhlYWRlckV4aXN0cyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhlYWRlckV4aXN0cyAmJiB0aGlzLl9oaXN0b3J5Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXBwZW5kQ29tbWVudCA9IChtb3ZlU3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gdGhpcy5fY29tbWVudHNbdGhpcy5mZW4oKV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVsaW1pdGVyID0gbW92ZVN0cmluZy5sZW5ndGggPiAwID8gJyAnIDogJyc7XG4gICAgICAgICAgICAgICAgbW92ZVN0cmluZyA9IGAke21vdmVTdHJpbmd9JHtkZWxpbWl0ZXJ9eyR7Y29tbWVudH19YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtb3ZlU3RyaW5nO1xuICAgICAgICB9O1xuICAgICAgICAvLyBwb3AgYWxsIG9mIGhpc3Rvcnkgb250byByZXZlcnNlZF9oaXN0b3J5XG4gICAgICAgIGNvbnN0IHJldmVyc2VkSGlzdG9yeSA9IFtdO1xuICAgICAgICB3aGlsZSAodGhpcy5faGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXZlcnNlZEhpc3RvcnkucHVzaCh0aGlzLl91bmRvTW92ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb3ZlcyA9IFtdO1xuICAgICAgICBsZXQgbW92ZVN0cmluZyA9ICcnO1xuICAgICAgICAvLyBzcGVjaWFsIGNhc2Ugb2YgYSBjb21tZW50ZWQgc3RhcnRpbmcgcG9zaXRpb24gd2l0aCBubyBtb3Zlc1xuICAgICAgICBpZiAocmV2ZXJzZWRIaXN0b3J5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbW92ZXMucHVzaChhcHBlbmRDb21tZW50KCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYnVpbGQgdGhlIGxpc3Qgb2YgbW92ZXMuICBhIG1vdmVfc3RyaW5nIGxvb2tzIGxpa2U6IFwiMy4gZTMgZTZcIlxuICAgICAgICB3aGlsZSAocmV2ZXJzZWRIaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG1vdmVTdHJpbmcgPSBhcHBlbmRDb21tZW50KG1vdmVTdHJpbmcpO1xuICAgICAgICAgICAgY29uc3QgbW92ZSA9IHJldmVyc2VkSGlzdG9yeS5wb3AoKTtcbiAgICAgICAgICAgIC8vIG1ha2UgVHlwZVNjcmlwdCBzdG9wIGNvbXBsYWluaW5nIGFib3V0IG1vdmUgYmVpbmcgdW5kZWZpbmVkXG4gICAgICAgICAgICBpZiAoIW1vdmUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHRoZSBwb3NpdGlvbiBzdGFydGVkIHdpdGggYmxhY2sgdG8gbW92ZSwgc3RhcnQgUEdOIHdpdGggIy4gLi4uXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hpc3RvcnkubGVuZ3RoICYmIG1vdmUuY29sb3IgPT09ICdiJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IGAke3RoaXMuX21vdmVOdW1iZXJ9LiAuLi5gO1xuICAgICAgICAgICAgICAgIC8vIGlzIHRoZXJlIGEgY29tbWVudCBwcmVjZWRpbmcgdGhlIGZpcnN0IG1vdmU/XG4gICAgICAgICAgICAgICAgbW92ZVN0cmluZyA9IG1vdmVTdHJpbmcgPyBgJHttb3ZlU3RyaW5nfSAke3ByZWZpeH1gIDogcHJlZml4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobW92ZS5jb2xvciA9PT0gJ3cnKSB7XG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgdGhlIHByZXZpb3VzIGdlbmVyYXRlZCBtb3ZlX3N0cmluZyBpZiB3ZSBoYXZlIG9uZVxuICAgICAgICAgICAgICAgIGlmIChtb3ZlU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBtb3Zlcy5wdXNoKG1vdmVTdHJpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb3ZlU3RyaW5nID0gdGhpcy5fbW92ZU51bWJlciArICcuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1vdmVTdHJpbmcgPVxuICAgICAgICAgICAgICAgIG1vdmVTdHJpbmcgKyAnICcgKyB0aGlzLl9tb3ZlVG9TYW4obW92ZSwgdGhpcy5fbW92ZXMoeyBsZWdhbDogdHJ1ZSB9KSk7XG4gICAgICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhcmUgdGhlcmUgYW55IG90aGVyIGxlZnRvdmVyIG1vdmVzP1xuICAgICAgICBpZiAobW92ZVN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goYXBwZW5kQ29tbWVudChtb3ZlU3RyaW5nKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaXMgdGhlcmUgYSByZXN1bHQ/XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5faGVhZGVyLlJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG1vdmVzLnB1c2godGhpcy5faGVhZGVyLlJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogaGlzdG9yeSBzaG91bGQgYmUgYmFjayB0byB3aGF0IGl0IHdhcyBiZWZvcmUgd2Ugc3RhcnRlZCBnZW5lcmF0aW5nIFBHTixcbiAgICAgICAgICogc28gam9pbiB0b2dldGhlciBtb3Zlc1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1heFdpZHRoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpICsgbW92ZXMuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE8gKGphaCk6IGh1aD9cbiAgICAgICAgY29uc3Qgc3RyaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnBvcCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICAvLyBOQjogdGhpcyBkb2VzIG5vdCBwcmVzZXJ2ZSBjb21tZW50IHdoaXRlc3BhY2UuXG4gICAgICAgIGNvbnN0IHdyYXBDb21tZW50ID0gZnVuY3Rpb24gKHdpZHRoLCBtb3ZlKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIG1vdmUuc3BsaXQoJyAnKSkge1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3aWR0aCArIHRva2VuLmxlbmd0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChzdHJpcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpO1xuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB3aWR0aCArPSB0b2tlbi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goJyAnKTtcbiAgICAgICAgICAgICAgICB3aWR0aCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmlwKCkpIHtcbiAgICAgICAgICAgICAgICB3aWR0aC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgICAgICB9O1xuICAgICAgICAvLyB3cmFwIHRoZSBQR04gb3V0cHV0IGF0IG1heF93aWR0aFxuICAgICAgICBsZXQgY3VycmVudFdpZHRoID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRXaWR0aCArIG1vdmVzW2ldLmxlbmd0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmVzW2ldLmluY2x1ZGVzKCd7JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFdpZHRoID0gd3JhcENvbW1lbnQoY3VycmVudFdpZHRoLCBtb3Zlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IG1vdmUgd2lsbCBwdXNoIHBhc3QgbWF4X3dpZHRoXG4gICAgICAgICAgICBpZiAoY3VycmVudFdpZHRoICsgbW92ZXNbaV0ubGVuZ3RoID4gbWF4V2lkdGggJiYgaSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGRvbid0IGVuZCB0aGUgbGluZSB3aXRoIHdoaXRlc3BhY2VcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudFdpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGkgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgnICcpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRXaWR0aCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobW92ZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFdpZHRoICs9IG1vdmVzW2ldLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgIH1cbiAgICBoZWFkZXIoLi4uYXJncykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnc1tpXSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyZ3NbaSArIDFdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRlclthcmdzW2ldXSA9IGFyZ3NbaSArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXI7XG4gICAgfVxuICAgIGxvYWRQZ24ocGduLCB7IHN0cmljdCA9IGZhbHNlLCBuZXdsaW5lQ2hhciA9ICdcXHI/XFxuJywgfSA9IHt9KSB7XG4gICAgICAgIGZ1bmN0aW9uIG1hc2soc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFwnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwYXJzZVBnbkhlYWRlcihoZWFkZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlck9iaiA9IHt9O1xuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IGhlYWRlci5zcGxpdChuZXcgUmVnRXhwKG1hc2sobmV3bGluZUNoYXIpKSk7XG4gICAgICAgICAgICBsZXQga2V5ID0gJyc7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVhZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gL15cXHMqXFxbXFxzKihbQS1aYS16XSspXFxzKlwiKC4qKVwiXFxzKlxcXVxccyokLztcbiAgICAgICAgICAgICAgICBrZXkgPSBoZWFkZXJzW2ldLnJlcGxhY2UocmVnZXgsICckMScpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaGVhZGVyc1tpXS5yZXBsYWNlKHJlZ2V4LCAnJDInKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlck9ialtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlck9iajtcbiAgICAgICAgfVxuICAgICAgICAvLyBzdHJpcCB3aGl0ZXNwYWNlIGZyb20gaGVhZC90YWlsIG9mIFBHTiBibG9ja1xuICAgICAgICBwZ24gPSBwZ24udHJpbSgpO1xuICAgICAgICAvKlxuICAgICAgICAgKiBSZWdFeHAgdG8gc3BsaXQgaGVhZGVyLiBUYWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCBoZWFkZXIgYW5kIG1vdmV0ZXh0XG4gICAgICAgICAqIHdpbGwgYWx3YXlzIGhhdmUgYSBibGFuayBsaW5lIGJldHdlZW4gdGhlbSAoaWUsIHR3byBuZXdsaW5lX2NoYXIncykuIEhhbmRsZXNcbiAgICAgICAgICogY2FzZSB3aGVyZSBtb3ZldGV4dCBpcyBlbXB0eSBieSBtYXRjaGluZyBuZXdsaW5lQ2hhciB1bnRpbCBlbmQgb2Ygc3RyaW5nIGlzXG4gICAgICAgICAqIG1hdGNoZWQgLSBlZmZlY3RpdmVseSB0cmltbWluZyBmcm9tIHRoZSBlbmQgZXh0cmEgbmV3bGluZUNoYXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdpdGggZGVmYXVsdCBuZXdsaW5lX2NoYXIsIHdpbGwgZXF1YWw6XG4gICAgICAgICAqIC9eKFxcWygoPzpcXHI/XFxuKXwuKSpcXF0pKCg/OlxccypcXHI/XFxuKXsyfXwoPzpcXHMqXFxyP1xcbikqJCkvXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBoZWFkZXJSZWdleCA9IG5ldyBSZWdFeHAoJ14oXFxcXFsoKD86JyArXG4gICAgICAgICAgICBtYXNrKG5ld2xpbmVDaGFyKSArXG4gICAgICAgICAgICAnKXwuKSpcXFxcXSknICtcbiAgICAgICAgICAgICcoKD86XFxcXHMqJyArXG4gICAgICAgICAgICBtYXNrKG5ld2xpbmVDaGFyKSArXG4gICAgICAgICAgICAnKXsyfXwoPzpcXFxccyonICtcbiAgICAgICAgICAgIG1hc2sobmV3bGluZUNoYXIpICtcbiAgICAgICAgICAgICcpKiQpJyk7XG4gICAgICAgIC8vIElmIG5vIGhlYWRlciBnaXZlbiwgYmVnaW4gd2l0aCBtb3Zlcy5cbiAgICAgICAgY29uc3QgaGVhZGVyUmVnZXhSZXN1bHRzID0gaGVhZGVyUmVnZXguZXhlYyhwZ24pO1xuICAgICAgICBjb25zdCBoZWFkZXJTdHJpbmcgPSBoZWFkZXJSZWdleFJlc3VsdHNcbiAgICAgICAgICAgID8gaGVhZGVyUmVnZXhSZXN1bHRzLmxlbmd0aCA+PSAyXG4gICAgICAgICAgICAgICAgPyBoZWFkZXJSZWdleFJlc3VsdHNbMV1cbiAgICAgICAgICAgICAgICA6ICcnXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICAvLyBQdXQgdGhlIGJvYXJkIGluIHRoZSBzdGFydGluZyBwb3NpdGlvblxuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIC8vIHBhcnNlIFBHTiBoZWFkZXJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHBhcnNlUGduSGVhZGVyKGhlYWRlclN0cmluZyk7XG4gICAgICAgIGxldCBmZW4gPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gaGVhZGVycykge1xuICAgICAgICAgICAgLy8gY2hlY2sgdG8gc2VlIHVzZXIgaXMgaW5jbHVkaW5nIGZlbiAocG9zc2libHkgd2l0aCB3cm9uZyB0YWcgY2FzZSlcbiAgICAgICAgICAgIGlmIChrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2ZlbicpIHtcbiAgICAgICAgICAgICAgICBmZW4gPSBoZWFkZXJzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhlYWRlcihrZXksIGhlYWRlcnNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogdGhlIHBlcm1pc3NpdmUgcGFyc2VyIHNob3VsZCBhdHRlbXB0IHRvIGxvYWQgYSBmZW4gdGFnLCBldmVuIGlmIGl0J3MgdGhlXG4gICAgICAgICAqIHdyb25nIGNhc2UgYW5kIGRvZXNuJ3QgaW5jbHVkZSBhIGNvcnJlc3BvbmRpbmcgW1NldFVwIFwiMVwiXSB0YWdcbiAgICAgICAgICovXG4gICAgICAgIGlmICghc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoZmVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKGZlbiwgeyBwcmVzZXJ2ZUhlYWRlcnM6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogc3RyaWN0IHBhcnNlciAtIGxvYWQgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uIGluZGljYXRlZCBieSBbU2V0dXAgJzEnXVxuICAgICAgICAgICAgICogYW5kIFtGRU4gcG9zaXRpb25dXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChoZWFkZXJzWydTZXRVcCddID09PSAnMScpIHtcbiAgICAgICAgICAgICAgICBpZiAoISgnRkVOJyBpbiBoZWFkZXJzKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgUEdOOiBGRU4gdGFnIG11c3QgYmUgc3VwcGxpZWQgd2l0aCBTZXRVcCB0YWcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgY2xlYXIgdGhlIGhlYWRlcnMgd2hlbiBsb2FkaW5nXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKGhlYWRlcnNbJ0ZFTiddLCB7IHByZXNlcnZlSGVhZGVyczogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBOQjogdGhlIHJlZ2V4ZXMgYmVsb3cgdGhhdCBkZWxldGUgbW92ZSBudW1iZXJzLCByZWN1cnNpdmUgYW5ub3RhdGlvbnMsXG4gICAgICAgICAqIGFuZCBudW1lcmljIGFubm90YXRpb24gZ2x5cGhzIG1heSBhbHNvIG1hdGNoIHRleHQgaW4gY29tbWVudHMuIFRvXG4gICAgICAgICAqIHByZXZlbnQgdGhpcywgd2UgdHJhbnNmb3JtIGNvbW1lbnRzIGJ5IGhleC1lbmNvZGluZyB0aGVtIGluIHBsYWNlIGFuZFxuICAgICAgICAgKiBkZWNvZGluZyB0aGVtIGFnYWluIGFmdGVyIHRoZSBvdGhlciB0b2tlbnMgaGF2ZSBiZWVuIGRlbGV0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdoaWxlIHRoZSBzcGVjIHN0YXRlcyB0aGF0IFBHTiBmaWxlcyBzaG91bGQgYmUgQVNDSUkgZW5jb2RlZCwgd2UgdXNlXG4gICAgICAgICAqIHtlbixkZX1jb2RlVVJJQ29tcG9uZW50IGhlcmUgdG8gc3VwcG9ydCBhcmJpdHJhcnkgVVRGOCBhcyBhIGNvbnZlbmllbmNlXG4gICAgICAgICAqIGZvciBtb2Rlcm4gdXNlcnNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRvSGV4KHMpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHMpXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogZW5jb2RlVVJJIGRvZXNuJ3QgdHJhbnNmb3JtIG1vc3QgQVNDSUkgY2hhcmFjdGVycywgc28gd2UgaGFuZGxlXG4gICAgICAgICAgICAgICAgICogdGhlc2Ugb3Vyc2VsdmVzXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSA8IDEyOFxuICAgICAgICAgICAgICAgICAgICA/IGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICAgICAgOiBlbmNvZGVVUklDb21wb25lbnQoYykucmVwbGFjZSgvJS9nLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmpvaW4oJycpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZyb21IZXgocykge1xuICAgICAgICAgICAgcmV0dXJuIHMubGVuZ3RoID09IDBcbiAgICAgICAgICAgICAgICA/ICcnXG4gICAgICAgICAgICAgICAgOiBkZWNvZGVVUklDb21wb25lbnQoJyUnICsgKHMubWF0Y2goLy57MSwyfS9nKSB8fCBbXSkuam9pbignJScpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmNvZGVDb21tZW50ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVDaGFyKSwgJ2cnKSwgJyAnKTtcbiAgICAgICAgICAgIHJldHVybiBgeyR7dG9IZXgocy5zbGljZSgxLCBzLmxlbmd0aCAtIDEpKX19YDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZGVjb2RlQ29tbWVudCA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICBpZiAocy5zdGFydHNXaXRoKCd7JykgJiYgcy5lbmRzV2l0aCgnfScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb21IZXgocy5zbGljZSgxLCBzLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gZGVsZXRlIGhlYWRlciB0byBnZXQgdGhlIG1vdmVzXG4gICAgICAgIGxldCBtcyA9IHBnblxuICAgICAgICAgICAgLnJlcGxhY2UoaGVhZGVyU3RyaW5nLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKFxuICAgICAgICAvLyBlbmNvZGUgY29tbWVudHMgc28gdGhleSBkb24ndCBnZXQgZGVsZXRlZCBiZWxvd1xuICAgICAgICBuZXcgUmVnRXhwKGAoe1tefV0qfSkrP3w7KFteJHttYXNrKG5ld2xpbmVDaGFyKX1dKilgLCAnZycpLCBmdW5jdGlvbiAoX21hdGNoLCBicmFja2V0LCBzZW1pY29sb24pIHtcbiAgICAgICAgICAgIHJldHVybiBicmFja2V0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA/IGVuY29kZUNvbW1lbnQoYnJhY2tldClcbiAgICAgICAgICAgICAgICA6ICcgJyArIGVuY29kZUNvbW1lbnQoYHske3NlbWljb2xvbi5zbGljZSgxKX19YCk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKG1hc2sobmV3bGluZUNoYXIpLCAnZycpLCAnICcpO1xuICAgICAgICAvLyBkZWxldGUgcmVjdXJzaXZlIGFubm90YXRpb24gdmFyaWF0aW9uc1xuICAgICAgICBjb25zdCByYXZSZWdleCA9IC8oXFwoW14oKV0rXFwpKSs/L2c7XG4gICAgICAgIHdoaWxlIChyYXZSZWdleC50ZXN0KG1zKSkge1xuICAgICAgICAgICAgbXMgPSBtcy5yZXBsYWNlKHJhdlJlZ2V4LCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGVsZXRlIG1vdmUgbnVtYmVyc1xuICAgICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcZCtcXC4oXFwuXFwuKT8vZywgJycpO1xuICAgICAgICAvLyBkZWxldGUgLi4uIGluZGljYXRpbmcgYmxhY2sgdG8gbW92ZVxuICAgICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcLlxcLlxcLi9nLCAnJyk7XG4gICAgICAgIC8qIGRlbGV0ZSBudW1lcmljIGFubm90YXRpb24gZ2x5cGhzICovXG4gICAgICAgIG1zID0gbXMucmVwbGFjZSgvXFwkXFxkKy9nLCAnJyk7XG4gICAgICAgIC8vIHRyaW0gYW5kIGdldCBhcnJheSBvZiBtb3Zlc1xuICAgICAgICBsZXQgbW92ZXMgPSBtcy50cmltKCkuc3BsaXQobmV3IFJlZ0V4cCgvXFxzKy8pKTtcbiAgICAgICAgLy8gZGVsZXRlIGVtcHR5IGVudHJpZXNcbiAgICAgICAgbW92ZXMgPSBtb3Zlcy5maWx0ZXIoKG1vdmUpID0+IG1vdmUgIT09ICcnKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBoYWxmTW92ZSA9IDA7IGhhbGZNb3ZlIDwgbW92ZXMubGVuZ3RoOyBoYWxmTW92ZSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gZGVjb2RlQ29tbWVudChtb3Zlc1toYWxmTW92ZV0pO1xuICAgICAgICAgICAgaWYgKGNvbW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW1lbnRzW3RoaXMuZmVuKCldID0gY29tbWVudDtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1vdmUgPSB0aGlzLl9tb3ZlRnJvbVNhbihtb3Zlc1toYWxmTW92ZV0sIHN0cmljdCk7XG4gICAgICAgICAgICAvLyBpbnZhbGlkIG1vdmVcbiAgICAgICAgICAgIGlmIChtb3ZlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3YXMgdGhlIG1vdmUgYW4gZW5kIG9mIGdhbWUgbWFya2VyXG4gICAgICAgICAgICAgICAgaWYgKFRFUk1JTkFUSU9OX01BUktFUlMuaW5kZXhPZihtb3Zlc1toYWxmTW92ZV0pID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gbW92ZXNbaGFsZk1vdmVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1vdmUgaW4gUEdOOiAke21vdmVzW2hhbGZNb3ZlXX1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgZW5kIG9mIGdhbWUgbWFya2VyIGlmIG1ha2luZyBhIHZhbGlkIG1vdmVcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAnJztcbiAgICAgICAgICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3ZlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3NpdGlvbkNvdW50c1t0aGlzLmZlbigpXSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIFBlciBzZWN0aW9uIDguMi42IG9mIHRoZSBQR04gc3BlYywgdGhlIFJlc3VsdCB0YWcgcGFpciBtdXN0IG1hdGNoIG1hdGNoXG4gICAgICAgICAqIHRoZSB0ZXJtaW5hdGlvbiBtYXJrZXIuIE9ubHkgZG8gdGhpcyB3aGVuIGhlYWRlcnMgYXJlIHByZXNlbnQsIGJ1dCB0aGVcbiAgICAgICAgICogcmVzdWx0IHRhZyBpcyBtaXNzaW5nXG4gICAgICAgICAqL1xuICAgICAgICBpZiAocmVzdWx0ICYmIE9iamVjdC5rZXlzKHRoaXMuX2hlYWRlcikubGVuZ3RoICYmICF0aGlzLl9oZWFkZXJbJ1Jlc3VsdCddKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcignUmVzdWx0JywgcmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKlxuICAgICAqIENvbnZlcnQgYSBtb3ZlIGZyb20gMHg4OCBjb29yZGluYXRlcyB0byBTdGFuZGFyZCBBbGdlYnJhaWMgTm90YXRpb25cbiAgICAgKiAoU0FOKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzdHJpY3QgVXNlIHRoZSBzdHJpY3QgU0FOIHBhcnNlci4gSXQgd2lsbCB0aHJvdyBlcnJvcnNcbiAgICAgKiBvbiBvdmVybHkgZGlzYW1iaWd1YXRlZCBtb3ZlcyAoc2VlIGJlbG93KTpcbiAgICAgKlxuICAgICAqIHIxYnFrYm5yL3BwcDJwcHAvMm41LzFCMXBQMy80UDMvOC9QUFBQMlBQL1JOQlFLMU5SIGIgS1FrcSAtIDIgNFxuICAgICAqIDQuIC4uLiBOZ2U3IGlzIG92ZXJseSBkaXNhbWJpZ3VhdGVkIGJlY2F1c2UgdGhlIGtuaWdodCBvbiBjNiBpcyBwaW5uZWRcbiAgICAgKiA0LiAuLi4gTmU3IGlzIHRlY2huaWNhbGx5IHRoZSB2YWxpZCBTQU5cbiAgICAgKi9cbiAgICBfbW92ZVRvU2FuKG1vdmUsIG1vdmVzKSB7XG4gICAgICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgb3V0cHV0ID0gJ08tTyc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSAnTy1PLU8nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1vdmUucGllY2UgIT09IFBBV04pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNhbWJpZ3VhdG9yID0gZ2V0RGlzYW1iaWd1YXRvcihtb3ZlLCBtb3Zlcyk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IG1vdmUucGllY2UudG9VcHBlckNhc2UoKSArIGRpc2FtYmlndWF0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobW92ZS5mbGFncyAmIChCSVRTLkNBUFRVUkUgfCBCSVRTLkVQX0NBUFRVUkUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUucGllY2UgPT09IFBBV04pIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFsZ2VicmFpYyhtb3ZlLmZyb20pWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ3gnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0cHV0ICs9IGFsZ2VicmFpYyhtb3ZlLnRvKTtcbiAgICAgICAgICAgIGlmIChtb3ZlLnByb21vdGlvbikge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnPScgKyBtb3ZlLnByb21vdGlvbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmUpO1xuICAgICAgICBpZiAodGhpcy5pc0NoZWNrKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ2hlY2ttYXRlKCkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJyMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICcrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91bmRvTW92ZSgpO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICAvLyBjb252ZXJ0IGEgbW92ZSBmcm9tIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvbiAoU0FOKSB0byAweDg4IGNvb3JkaW5hdGVzXG4gICAgX21vdmVGcm9tU2FuKG1vdmUsIHN0cmljdCA9IGZhbHNlKSB7XG4gICAgICAgIC8vIHN0cmlwIG9mZiBhbnkgbW92ZSBkZWNvcmF0aW9uczogZS5nIE5mMys/ISBiZWNvbWVzIE5mM1xuICAgICAgICBjb25zdCBjbGVhbk1vdmUgPSBzdHJpcHBlZFNhbihtb3ZlKTtcbiAgICAgICAgbGV0IHBpZWNlVHlwZSA9IGluZmVyUGllY2VUeXBlKGNsZWFuTW92ZSk7XG4gICAgICAgIGxldCBtb3ZlcyA9IHRoaXMuX21vdmVzKHsgbGVnYWw6IHRydWUsIHBpZWNlOiBwaWVjZVR5cGUgfSk7XG4gICAgICAgIC8vIHN0cmljdCBwYXJzZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY2xlYW5Nb3ZlID09PSBzdHJpcHBlZFNhbih0aGlzLl9tb3ZlVG9TYW4obW92ZXNbaV0sIG1vdmVzKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW92ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhlIHN0cmljdCBwYXJzZXIgZmFpbGVkXG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwaWVjZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IG1hdGNoZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBmcm9tID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgdG8gPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBwcm9tb3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IHBlcm1pc3NpdmUgKG5vbi1zdHJpY3QpIHBhcnNlciBhbGxvd3MgdGhlIHVzZXIgdG8gcGFyc2VcbiAgICAgICAgICogbm9uLXN0YW5kYXJkIGNoZXNzIG5vdGF0aW9ucy4gVGhpcyBwYXJzZXIgaXMgb25seSBydW4gYWZ0ZXIgdGhlIHN0cmljdFxuICAgICAgICAgKiBTdGFuZGFyZCBBbGdlYnJhaWMgTm90YXRpb24gKFNBTikgcGFyc2VyIGhhcyBmYWlsZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdoZW4gcnVubmluZyB0aGUgcGVybWlzc2l2ZSBwYXJzZXIsIHdlJ2xsIHJ1biBhIHJlZ2V4IHRvIGdyYWIgdGhlIHBpZWNlLCB0aGVcbiAgICAgICAgICogdG8vZnJvbSBzcXVhcmUsIGFuZCBhbiBvcHRpb25hbCBwcm9tb3Rpb24gcGllY2UuIFRoaXMgcmVnZXggd2lsbFxuICAgICAgICAgKiBwYXJzZSBjb21tb24gbm9uLXN0YW5kYXJkIG5vdGF0aW9uIGxpa2U6IFBlMi1lNCwgUmMxYzQsIFFmM3hmNyxcbiAgICAgICAgICogZjdmOHEsIGIxYzNcbiAgICAgICAgICpcbiAgICAgICAgICogTk9URTogU29tZSBwb3NpdGlvbnMgYW5kIG1vdmVzIG1heSBiZSBhbWJpZ3VvdXMgd2hlbiB1c2luZyB0aGUgcGVybWlzc2l2ZVxuICAgICAgICAgKiBwYXJzZXIuIEZvciBleGFtcGxlLCBpbiB0aGlzIHBvc2l0aW9uOiA2azEvOC84L0I3LzgvOC84L0JONEsxIHcgLSAtIDAgMSxcbiAgICAgICAgICogdGhlIG1vdmUgYjFjMyBtYXkgYmUgaW50ZXJwcmV0ZWQgYXMgTmMzIG9yIEIxYzMgKGEgZGlzYW1iaWd1YXRlZCBiaXNob3BcbiAgICAgICAgICogbW92ZSkuIEluIHRoZXNlIGNhc2VzLCB0aGUgcGVybWlzc2l2ZSBwYXJzZXIgd2lsbCBkZWZhdWx0IHRvIHRoZSBtb3N0XG4gICAgICAgICAqIGJhc2ljIGludGVycHJldGF0aW9uICh3aGljaCBpcyBiMWMzIHBhcnNpbmcgdG8gTmMzKS5cbiAgICAgICAgICovXG4gICAgICAgIGxldCBvdmVybHlEaXNhbWJpZ3VhdGVkID0gZmFsc2U7XG4gICAgICAgIG1hdGNoZXMgPSBjbGVhbk1vdmUubWF0Y2goLyhbcG5icnFrUE5CUlFLXSk/KFthLWhdWzEtOF0peD8tPyhbYS1oXVsxLThdKShbcXJiblFSQk5dKT8vKTtcbiAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgIHBpZWNlID0gbWF0Y2hlc1sxXTtcbiAgICAgICAgICAgIGZyb20gPSBtYXRjaGVzWzJdO1xuICAgICAgICAgICAgdG8gPSBtYXRjaGVzWzNdO1xuICAgICAgICAgICAgcHJvbW90aW9uID0gbWF0Y2hlc1s0XTtcbiAgICAgICAgICAgIGlmIChmcm9tLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgb3Zlcmx5RGlzYW1iaWd1YXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVGhlIFthLWhdP1sxLThdPyBwb3J0aW9uIG9mIHRoZSByZWdleCBiZWxvdyBoYW5kbGVzIG1vdmVzIHRoYXQgbWF5IGJlXG4gICAgICAgICAgICAgKiBvdmVybHkgZGlzYW1iaWd1YXRlZCAoZS5nLiBOZ2U3IGlzIHVubmVjZXNzYXJ5IGFuZCBub24tc3RhbmRhcmQgd2hlblxuICAgICAgICAgICAgICogdGhlcmUgaXMgb25lIGxlZ2FsIGtuaWdodCBtb3ZlIHRvIGU3KS4gSW4gdGhpcyBjYXNlLCB0aGUgdmFsdWUgb2ZcbiAgICAgICAgICAgICAqICdmcm9tJyB2YXJpYWJsZSB3aWxsIGJlIGEgcmFuayBvciBmaWxlLCBub3QgYSBzcXVhcmUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1hdGNoZXMgPSBjbGVhbk1vdmUubWF0Y2goLyhbcG5icnFrUE5CUlFLXSk/KFthLWhdP1sxLThdPyl4Py0/KFthLWhdWzEtOF0pKFtxcmJuUVJCTl0pPy8pO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBwaWVjZSA9IG1hdGNoZXNbMV07XG4gICAgICAgICAgICAgICAgZnJvbSA9IG1hdGNoZXNbMl07XG4gICAgICAgICAgICAgICAgdG8gPSBtYXRjaGVzWzNdO1xuICAgICAgICAgICAgICAgIHByb21vdGlvbiA9IG1hdGNoZXNbNF07XG4gICAgICAgICAgICAgICAgaWYgKGZyb20ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3Zlcmx5RGlzYW1iaWd1YXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBpZWNlVHlwZSA9IGluZmVyUGllY2VUeXBlKGNsZWFuTW92ZSk7XG4gICAgICAgIG1vdmVzID0gdGhpcy5fbW92ZXMoe1xuICAgICAgICAgICAgbGVnYWw6IHRydWUsXG4gICAgICAgICAgICBwaWVjZTogcGllY2UgPyBwaWVjZSA6IHBpZWNlVHlwZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghdG8pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKCFmcm9tKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gZnJvbSBzcXVhcmUsIGl0IGNvdWxkIGJlIGp1c3QgJ3gnIG1pc3NpbmcgZnJvbSBhIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBpZiAoY2xlYW5Nb3ZlID09PVxuICAgICAgICAgICAgICAgICAgICBzdHJpcHBlZFNhbih0aGlzLl9tb3ZlVG9TYW4obW92ZXNbaV0sIG1vdmVzKSkucmVwbGFjZSgneCcsICcnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW92ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGhhbmQtY29tcGFyZSBtb3ZlIHByb3BlcnRpZXMgd2l0aCB0aGUgcmVzdWx0cyBmcm9tIG91ciBwZXJtaXNzaXZlIHJlZ2V4XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgoIXBpZWNlIHx8IHBpZWNlLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucGllY2UpICYmXG4gICAgICAgICAgICAgICAgT3g4OFtmcm9tXSA9PSBtb3Zlc1tpXS5mcm9tICYmXG4gICAgICAgICAgICAgICAgT3g4OFt0b10gPT0gbW92ZXNbaV0udG8gJiZcbiAgICAgICAgICAgICAgICAoIXByb21vdGlvbiB8fCBwcm9tb3Rpb24udG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5wcm9tb3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAob3Zlcmx5RGlzYW1iaWd1YXRlZCkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogU1BFQ0lBTCBDQVNFOiB3ZSBwYXJzZWQgYSBtb3ZlIHN0cmluZyB0aGF0IG1heSBoYXZlIGFuIHVubmVlZGVkXG4gICAgICAgICAgICAgICAgICogcmFuay9maWxlIGRpc2FtYmlndWF0b3IgKGUuZy4gTmdlNykuICBUaGUgJ2Zyb20nIHZhcmlhYmxlIHdpbGxcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBhbGdlYnJhaWMobW92ZXNbaV0uZnJvbSk7XG4gICAgICAgICAgICAgICAgaWYgKCghcGllY2UgfHwgcGllY2UudG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5waWVjZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgT3g4OFt0b10gPT0gbW92ZXNbaV0udG8gJiZcbiAgICAgICAgICAgICAgICAgICAgKGZyb20gPT0gc3F1YXJlWzBdIHx8IGZyb20gPT0gc3F1YXJlWzFdKSAmJlxuICAgICAgICAgICAgICAgICAgICAoIXByb21vdGlvbiB8fCBwcm9tb3Rpb24udG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5wcm9tb3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb3Zlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGFzY2lpKCkge1xuICAgICAgICBsZXQgcyA9ICcgICArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xcbic7XG4gICAgICAgIGZvciAobGV0IGkgPSBPeDg4LmE4OyBpIDw9IE94ODguaDE7IGkrKykge1xuICAgICAgICAgICAgLy8gZGlzcGxheSB0aGUgcmFua1xuICAgICAgICAgICAgaWYgKGZpbGUoaSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzICs9ICcgJyArICc4NzY1NDMyMSdbcmFuayhpKV0gKyAnIHwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW2ldKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGllY2UgPSB0aGlzLl9ib2FyZFtpXS50eXBlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5fYm9hcmRbaV0uY29sb3I7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sID0gY29sb3IgPT09IFdISVRFID8gcGllY2UudG9VcHBlckNhc2UoKSA6IHBpZWNlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgcyArPSAnICcgKyBzeW1ib2wgKyAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzICs9ICcgLiAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgICAgICAgICAgcyArPSAnfFxcbic7XG4gICAgICAgICAgICAgICAgaSArPSA4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHMgKz0gJyAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXFxuJztcbiAgICAgICAgcyArPSAnICAgICBhICBiICBjICBkICBlICBmICBnICBoJztcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIHBlcmZ0KGRlcHRoKSB7XG4gICAgICAgIGNvbnN0IG1vdmVzID0gdGhpcy5fbW92ZXMoeyBsZWdhbDogZmFsc2UgfSk7XG4gICAgICAgIGxldCBub2RlcyA9IDA7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5fdHVybjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3Zlc1tpXSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzS2luZ0F0dGFja2VkKGNvbG9yKSkge1xuICAgICAgICAgICAgICAgIGlmIChkZXB0aCAtIDEgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzICs9IHRoaXMucGVyZnQoZGVwdGggLSAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdW5kb01vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICAgIC8vIHByZXR0eSA9IGV4dGVybmFsIG1vdmUgb2JqZWN0XG4gICAgX21ha2VQcmV0dHkodWdseU1vdmUpIHtcbiAgICAgICAgY29uc3QgeyBjb2xvciwgcGllY2UsIGZyb20sIHRvLCBmbGFncywgY2FwdHVyZWQsIHByb21vdGlvbiB9ID0gdWdseU1vdmU7XG4gICAgICAgIGxldCBwcmV0dHlGbGFncyA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGZsYWcgaW4gQklUUykge1xuICAgICAgICAgICAgaWYgKEJJVFNbZmxhZ10gJiBmbGFncykge1xuICAgICAgICAgICAgICAgIHByZXR0eUZsYWdzICs9IEZMQUdTW2ZsYWddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZyb21BbGdlYnJhaWMgPSBhbGdlYnJhaWMoZnJvbSk7XG4gICAgICAgIGNvbnN0IHRvQWxnZWJyYWljID0gYWxnZWJyYWljKHRvKTtcbiAgICAgICAgY29uc3QgbW92ZSA9IHtcbiAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgcGllY2UsXG4gICAgICAgICAgICBmcm9tOiBmcm9tQWxnZWJyYWljLFxuICAgICAgICAgICAgdG86IHRvQWxnZWJyYWljLFxuICAgICAgICAgICAgc2FuOiB0aGlzLl9tb3ZlVG9TYW4odWdseU1vdmUsIHRoaXMuX21vdmVzKHsgbGVnYWw6IHRydWUgfSkpLFxuICAgICAgICAgICAgZmxhZ3M6IHByZXR0eUZsYWdzLFxuICAgICAgICAgICAgbGFuOiBmcm9tQWxnZWJyYWljICsgdG9BbGdlYnJhaWMsXG4gICAgICAgICAgICBiZWZvcmU6IHRoaXMuZmVuKCksXG4gICAgICAgICAgICBhZnRlcjogJycsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGdlbmVyYXRlIHRoZSBGRU4gZm9yIHRoZSAnYWZ0ZXInIGtleVxuICAgICAgICB0aGlzLl9tYWtlTW92ZSh1Z2x5TW92ZSk7XG4gICAgICAgIG1vdmUuYWZ0ZXIgPSB0aGlzLmZlbigpO1xuICAgICAgICB0aGlzLl91bmRvTW92ZSgpO1xuICAgICAgICBpZiAoY2FwdHVyZWQpIHtcbiAgICAgICAgICAgIG1vdmUuY2FwdHVyZWQgPSBjYXB0dXJlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvbW90aW9uKSB7XG4gICAgICAgICAgICBtb3ZlLnByb21vdGlvbiA9IHByb21vdGlvbjtcbiAgICAgICAgICAgIG1vdmUubGFuICs9IHByb21vdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW92ZTtcbiAgICB9XG4gICAgdHVybigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R1cm47XG4gICAgfVxuICAgIGJvYXJkKCkge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgICAgICAgbGV0IHJvdyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gT3g4OC5hODsgaSA8PSBPeDg4LmgxOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFtpXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcm93LnB1c2gobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHNxdWFyZTogYWxnZWJyYWljKGkpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLl9ib2FyZFtpXS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5fYm9hcmRbaV0uY29sb3IsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGkgKyAxKSAmIDB4ODgpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIHJvdyA9IFtdO1xuICAgICAgICAgICAgICAgIGkgKz0gODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICBzcXVhcmVDb2xvcihzcXVhcmUpIHtcbiAgICAgICAgaWYgKHNxdWFyZSBpbiBPeDg4KSB7XG4gICAgICAgICAgICBjb25zdCBzcSA9IE94ODhbc3F1YXJlXTtcbiAgICAgICAgICAgIHJldHVybiAocmFuayhzcSkgKyBmaWxlKHNxKSkgJSAyID09PSAwID8gJ2xpZ2h0JyA6ICdkYXJrJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaGlzdG9yeSh7IHZlcmJvc2UgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgcmV2ZXJzZWRIaXN0b3J5ID0gW107XG4gICAgICAgIGNvbnN0IG1vdmVIaXN0b3J5ID0gW107XG4gICAgICAgIHdoaWxlICh0aGlzLl9oaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldmVyc2VkSGlzdG9yeS5wdXNoKHRoaXMuX3VuZG9Nb3ZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gcmV2ZXJzZWRIaXN0b3J5LnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFtb3ZlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmVyYm9zZSkge1xuICAgICAgICAgICAgICAgIG1vdmVIaXN0b3J5LnB1c2godGhpcy5fbWFrZVByZXR0eShtb3ZlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3ZlSGlzdG9yeS5wdXNoKHRoaXMuX21vdmVUb1Nhbihtb3ZlLCB0aGlzLl9tb3ZlcygpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW92ZUhpc3Rvcnk7XG4gICAgfVxuICAgIF9wcnVuZUNvbW1lbnRzKCkge1xuICAgICAgICBjb25zdCByZXZlcnNlZEhpc3RvcnkgPSBbXTtcbiAgICAgICAgY29uc3QgY3VycmVudENvbW1lbnRzID0ge307XG4gICAgICAgIGNvbnN0IGNvcHlDb21tZW50ID0gKGZlbikgPT4ge1xuICAgICAgICAgICAgaWYgKGZlbiBpbiB0aGlzLl9jb21tZW50cykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRDb21tZW50c1tmZW5dID0gdGhpcy5fY29tbWVudHNbZmVuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgd2hpbGUgKHRoaXMuX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV2ZXJzZWRIaXN0b3J5LnB1c2godGhpcy5fdW5kb01vdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29weUNvbW1lbnQodGhpcy5mZW4oKSk7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gcmV2ZXJzZWRIaXN0b3J5LnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFtb3ZlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3ZlKTtcbiAgICAgICAgICAgIGNvcHlDb21tZW50KHRoaXMuZmVuKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbW1lbnRzID0gY3VycmVudENvbW1lbnRzO1xuICAgIH1cbiAgICBnZXRDb21tZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tbWVudHNbdGhpcy5mZW4oKV07XG4gICAgfVxuICAgIHNldENvbW1lbnQoY29tbWVudCkge1xuICAgICAgICB0aGlzLl9jb21tZW50c1t0aGlzLmZlbigpXSA9IGNvbW1lbnQucmVwbGFjZSgneycsICdbJykucmVwbGFjZSgnfScsICddJyk7XG4gICAgfVxuICAgIGRlbGV0ZUNvbW1lbnQoKSB7XG4gICAgICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLl9jb21tZW50c1t0aGlzLmZlbigpXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbW1lbnRzW3RoaXMuZmVuKCldO1xuICAgICAgICByZXR1cm4gY29tbWVudDtcbiAgICB9XG4gICAgZ2V0Q29tbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3BydW5lQ29tbWVudHMoKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2NvbW1lbnRzKS5tYXAoKGZlbikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgZmVuOiBmZW4sIGNvbW1lbnQ6IHRoaXMuX2NvbW1lbnRzW2Zlbl0gfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlbGV0ZUNvbW1lbnRzKCkge1xuICAgICAgICB0aGlzLl9wcnVuZUNvbW1lbnRzKCk7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9jb21tZW50cykubWFwKChmZW4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLl9jb21tZW50c1tmZW5dO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NvbW1lbnRzW2Zlbl07XG4gICAgICAgICAgICByZXR1cm4geyBmZW46IGZlbiwgY29tbWVudDogY29tbWVudCB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2V0Q2FzdGxpbmdSaWdodHMoY29sb3IsIHJpZ2h0cykge1xuICAgICAgICBmb3IgKGNvbnN0IHNpZGUgb2YgW0tJTkcsIFFVRUVOXSkge1xuICAgICAgICAgICAgaWYgKHJpZ2h0c1tzaWRlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0c1tzaWRlXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXN0bGluZ1tjb2xvcl0gfD0gU0lERVNbc2lkZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXN0bGluZ1tjb2xvcl0gJj0gflNJREVTW3NpZGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVDYXN0bGluZ1JpZ2h0cygpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmdldENhc3RsaW5nUmlnaHRzKGNvbG9yKTtcbiAgICAgICAgcmV0dXJuICgocmlnaHRzW0tJTkddID09PSB1bmRlZmluZWQgfHwgcmlnaHRzW0tJTkddID09PSByZXN1bHRbS0lOR10pICYmXG4gICAgICAgICAgICAocmlnaHRzW1FVRUVOXSA9PT0gdW5kZWZpbmVkIHx8IHJpZ2h0c1tRVUVFTl0gPT09IHJlc3VsdFtRVUVFTl0pKTtcbiAgICB9XG4gICAgZ2V0Q2FzdGxpbmdSaWdodHMoY29sb3IpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFtLSU5HXTogKHRoaXMuX2Nhc3RsaW5nW2NvbG9yXSAmIFNJREVTW0tJTkddKSAhPT0gMCxcbiAgICAgICAgICAgIFtRVUVFTl06ICh0aGlzLl9jYXN0bGluZ1tjb2xvcl0gJiBTSURFU1tRVUVFTl0pICE9PSAwLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBtb3ZlTnVtYmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW92ZU51bWJlcjtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaGVzcy5qcy5tYXAiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLnBsYXllcntcclxuICAgIGNvbHVtbi1jb3VudDoyO1xyXG4gICAgaGVpZ2h0OjR2aDtcclxufVxyXG4ucGxheWVyLmFib3Zle1xyXG4gICAgcGFkZGluZy10b3A6NHB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogLTNweDtcclxufVxyXG4ucGxheWVyLmJlbG93e1xyXG4gICAgbWFyZ2luLXRvcDotMXB4O1xyXG59XHJcbi5wbGF5ZXIuYmVsb3cgLmNhcHR1cmVze1xyXG4gICAgbWFyZ2luLXRvcDotNnB4O1xyXG59XHJcbi5wbGF5ZXIgLm5hbWV7XHJcbiAgICBjbGVhcjpib3RoO1xyXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OjRweDtcclxuICAgIGxpbmUtaGVpZ2h0OjN2aDtcclxufVxyXG4ucGxheWVyIC5jYXB0dXJlc3tcclxuICAgIGZsb2F0OmxlZnQ7XHJcbiAgICBtYXJnaW4tdG9wOi01cHg7XHJcbn1cclxuLnBsYXllciAuc2NvcmV7XHJcbiAgICBmbG9hdDpsZWZ0O1xyXG4gICAgbWFyZ2luLWxlZnQ6NXB4O1xyXG4gICAgbWFyZ2luLXRvcDoycHg7XHJcbiAgICBmb250LXNpemU6MTBwdDtcclxufVxyXG4ucGxheWVyIC5jYXB0dXJlcyBzdmd7XHJcbiAgICBwb3NpdGlvbjpzdGF0aWM7XHJcbiAgICBoZWlnaHQ6NHZoO1xyXG4gICAgd2lkdGg6NHZoO1xyXG4gICAgdHJhbnNmb3JtOm5vbmU7XHJcbiAgICBtYXJnaW4tdG9wOjA7XHJcbiAgICBtYXJnaW4tYm90dG9tOi0xMXB4O1xyXG59XHJcbi5wbGF5ZXIud2hpdGUgLmNhcHR1cmVzIHNwYW57XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogN3B4O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIC5wIHN2ZzpmaXJzdC1jaGlsZHtcclxuICAgIHBhZGRpbmctbGVmdDo0cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLnAgc3Zne1xyXG4gICAgbWFyZ2luLWxlZnQ6LThweDtcclxuICAgIG1hcmdpbi1yaWdodDotNXB4O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIC5ue1xyXG4gICAgbWFyZ2luLWxlZnQ6IDJweDtcclxuICAgIG1hcmdpbi1yaWdodDogMXB4O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIC5uIHN2Z3tcclxuICAgIG1hcmdpbi1sZWZ0OiAtNnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAtM3B4O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIC5iIHN2Z3tcclxuICAgIG1hcmdpbi1sZWZ0OiAtN3B4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAtNHB4O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIC5yIHN2Z3tcclxuICAgIG1hcmdpbi1sZWZ0OiAtNnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAtNXB4O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIC5xIHN2Z3tcclxuICAgIG1hcmdpbi1ib3R0b206LTEwcHg7XHJcbiAgICBtYXJnaW4tbGVmdDogLTJweDtcclxuICAgIG1hcmdpbi1yaWdodDogMHB4O1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY29tcG9uZW50cy92Mi9nYW1lQnJvd3Nlci9nYW1lQnJvd3Nlci5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxjQUFjO0lBQ2QsVUFBVTtBQUNkO0FBQ0E7SUFDSSxlQUFlO0lBQ2YsbUJBQW1CO0FBQ3ZCO0FBQ0E7SUFDSSxlQUFlO0FBQ25CO0FBQ0E7SUFDSSxlQUFlO0FBQ25CO0FBQ0E7SUFDSSxVQUFVO0lBQ1YsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixlQUFlO0FBQ25CO0FBQ0E7SUFDSSxVQUFVO0lBQ1YsZUFBZTtBQUNuQjtBQUNBO0lBQ0ksVUFBVTtJQUNWLGVBQWU7SUFDZixjQUFjO0lBQ2QsY0FBYztBQUNsQjtBQUNBO0lBQ0ksZUFBZTtJQUNmLFVBQVU7SUFDVixTQUFTO0lBQ1QsY0FBYztJQUNkLFlBQVk7SUFDWixtQkFBbUI7QUFDdkI7QUFDQTtJQUNJLG1CQUFtQjtBQUN2QjtBQUNBO0lBQ0ksZ0JBQWdCO0FBQ3BCO0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxtQkFBbUI7SUFDbkIsaUJBQWlCO0lBQ2pCLGlCQUFpQjtBQUNyQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIucGxheWVye1xcclxcbiAgICBjb2x1bW4tY291bnQ6MjtcXHJcXG4gICAgaGVpZ2h0OjR2aDtcXHJcXG59XFxyXFxuLnBsYXllci5hYm92ZXtcXHJcXG4gICAgcGFkZGluZy10b3A6NHB4O1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAtM3B4O1xcclxcbn1cXHJcXG4ucGxheWVyLmJlbG93e1xcclxcbiAgICBtYXJnaW4tdG9wOi0xcHg7XFxyXFxufVxcclxcbi5wbGF5ZXIuYmVsb3cgLmNhcHR1cmVze1xcclxcbiAgICBtYXJnaW4tdG9wOi02cHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLm5hbWV7XFxyXFxuICAgIGNsZWFyOmJvdGg7XFxyXFxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xcclxcbiAgICBwYWRkaW5nLXJpZ2h0OjRweDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6M3ZoO1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlc3tcXHJcXG4gICAgZmxvYXQ6bGVmdDtcXHJcXG4gICAgbWFyZ2luLXRvcDotNXB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5zY29yZXtcXHJcXG4gICAgZmxvYXQ6bGVmdDtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6NXB4O1xcclxcbiAgICBtYXJnaW4tdG9wOjJweDtcXHJcXG4gICAgZm9udC1zaXplOjEwcHQ7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIHN2Z3tcXHJcXG4gICAgcG9zaXRpb246c3RhdGljO1xcclxcbiAgICBoZWlnaHQ6NHZoO1xcclxcbiAgICB3aWR0aDo0dmg7XFxyXFxuICAgIHRyYW5zZm9ybTpub25lO1xcclxcbiAgICBtYXJnaW4tdG9wOjA7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206LTExcHg7XFxyXFxufVxcclxcbi5wbGF5ZXIud2hpdGUgLmNhcHR1cmVzIHNwYW57XFxyXFxuICAgIHBhZGRpbmctYm90dG9tOiA3cHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIC5wIHN2ZzpmaXJzdC1jaGlsZHtcXHJcXG4gICAgcGFkZGluZy1sZWZ0OjRweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLnAgc3Zne1xcclxcbiAgICBtYXJnaW4tbGVmdDotOHB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6LTVweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLm57XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAycHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMXB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlcyAubiBzdmd7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAtNnB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IC0zcHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIC5iIHN2Z3tcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IC03cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogLTRweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLnIgc3Zne1xcclxcbiAgICBtYXJnaW4tbGVmdDogLTZweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAtNXB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlcyAucSBzdmd7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206LTEwcHg7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAtMnB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDBweDtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBib2R5e3BhZGRpbmc6MDttYXJnaW46MDt9YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcGFnZXMvb3BlbmluZ3Mvb3BlbmluZ3MuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLEtBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQ1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCJib2R5e3BhZGRpbmc6MDttYXJnaW46MDt9XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vZ2FtZUJyb3dzZXIuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lQnJvd3Nlci5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vb3BlbmluZ3MuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9vcGVuaW5ncy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImltcG9ydCBCb2FyZExheWVyIGZyb20gXCIuL0xheWVycy9Cb2FyZExheWVyXCI7XHJcbmltcG9ydCBDb3Jkc0xheWVyIGZyb20gXCIuL0xheWVycy9Db3Jkc0xheWVyXCI7XHJcbmltcG9ydCBQaWVjZUxheWVyIGZyb20gXCIuL0xheWVycy9QaWVjZUxheWVyXCI7XHJcbmltcG9ydCBBcnJvd0xheWVyIGZyb20gXCIuL0xheWVycy9BcnJvd0xheWVyXCI7XHJcbmltcG9ydCBNb3VzZUV2ZW50cyBmcm9tIFwiLi9Nb3VzZUV2ZW50c1wiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuL1NoYXJlZFwiO1xyXG5pbXBvcnQgUGllY2UgZnJvbSBcIi4vUGllY2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZXNzYm9hcmR7XHJcbiAgICBzdmdSb290OlNWR1NWR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGJvYXJkTGF5ZXI6Qm9hcmRMYXllcjtcclxuICAgIHByaXZhdGUgY29yZHNMYXllcjpDb3Jkc0xheWVyO1xyXG4gICAgcHJpdmF0ZSBwaWVjZUxheWVyOlBpZWNlTGF5ZXI7XHJcbiAgICBwcml2YXRlIGFycm93TGF5ZXI6QXJyb3dMYXllcjtcclxuICAgIHByaXZhdGUgbW91c2VFdmVudHM6TW91c2VFdmVudHNcclxuICAgIHByaXZhdGUgaXNSb3RhdGVkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYm9hcmRDb250YWluZXI6SFRNTEVsZW1lbnQsIGZlbjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDgwMCA4MDAnKTtcclxuICAgICAgICBib2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN2Z1Jvb3QpO1xyXG5cclxuICAgICAgICB0aGlzLmJvYXJkTGF5ZXIgPSBuZXcgQm9hcmRMYXllcih0aGlzLnN2Z1Jvb3QsIGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5jb3Jkc0xheWVyID0gbmV3IENvcmRzTGF5ZXIodGhpcy5zdmdSb290LCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMucGllY2VMYXllciA9IG5ldyBQaWVjZUxheWVyKHRoaXMuc3ZnUm9vdCwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLmFycm93TGF5ZXIgPSBuZXcgQXJyb3dMYXllcih0aGlzLnN2Z1Jvb3QsIGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5tb3VzZUV2ZW50cyA9IG5ldyBNb3VzZUV2ZW50cyh0aGlzLnN2Z1Jvb3QsIHRoaXMuYm9hcmRMYXllciwgdGhpcy5hcnJvd0xheWVyLCB0aGlzLmlzUm90YXRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RmVuKGZlbiwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKCl7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSAhdGhpcy5pc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5ib2FyZExheWVyLnJvdGF0ZSh0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5jb3Jkc0xheWVyLnJvdGF0ZSh0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5waWVjZUxheWVyLnJvdGF0ZSh0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5hcnJvd0xheWVyLnJvdGF0ZSh0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5tb3VzZUV2ZW50cy5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgfVxyXG4gICAgc2V0RmVuKGZlbjpzdHJpbmcsIGNsZWFyRmlyc3Q6Ym9vbGVhbil7XHJcbiAgICAgICAgaWYgKGNsZWFyRmlyc3Qpe1xyXG4gICAgICAgICAgICB0aGlzLnBpZWNlTGF5ZXIuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZlbiAhPT0gXCJcIil7XHJcbiAgICAgICAgICAgIGlmIChmZW4udG9Mb3dlckNhc2UoKSA9PT0gXCJzdGFydFwiKVxyXG4gICAgICAgICAgICAgICAgZmVuID0gU2hhcmVkLnN0YXJ0RkVOO1xyXG4gICAgICAgICAgICBmZW4gPSBmZW4uc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiL1wiKS5qb2luKFwiXCIpO1xyXG4gICAgICAgICAgICBsZXQgc3F1YXJlSW5kZXggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmVuQ2hhciA9IGZlbltpXTtcclxuICAgICAgICAgICAgICAgIGxldCBudW1tZXJpY1ZhbHVlID0gcGFyc2VJbnQoZmVuQ2hhcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG51bW1lcmljVmFsdWUpKXtcclxuICAgICAgICAgICAgICAgICAgICBzcXVhcmVJbmRleCArPSBudW1tZXJpY1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm90YXRlZEluZGV4ID0gdGhpcy5pc1JvdGF0ZWQgPyA2MyAtIHNxdWFyZUluZGV4IDogc3F1YXJlSW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IFNoYXJlZC5nZXRTcXVhcmVLZXlCeUluZGV4KHJvdGF0ZWRJbmRleCwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGllY2VMYXllci5hZGRQaWVjZShmZW5DaGFyLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNxdWFyZUluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRQaWVjZShzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5waWVjZUxheWVyLmdldFBpZWNlKHNxdWFyZUtleSk7XHJcbiAgICB9XHJcbiAgICBhZGRQaWVjZShmZW5DaGFyOnN0cmluZywgc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGllY2VMYXllci5hZGRQaWVjZShmZW5DaGFyLCBzcXVhcmVLZXkpO1xyXG4gICAgfVxyXG4gICAgdW5kb1BpZWNlUmVtb3ZhbChwaWVjZTpQaWVjZSl7XHJcbiAgICAgICAgdGhpcy5waWVjZUxheWVyLnVuZG9QaWVjZVJlbW92YWwocGllY2UpO1xyXG4gICAgfVxyXG4gICAgcHV0UGllY2VCYWNrV2l0aE5ld1Bvc2l0aW9uKHBpZWNlOlBpZWNlLCBzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBwaWVjZS5zcXVhcmVLZXkgPSBzcXVhcmVLZXk7XHJcbiAgICAgICAgdGhpcy5waWVjZUxheWVyLnVuZG9QaWVjZVJlbW92YWwocGllY2UpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlUGllY2VCeVNxdWFyZUtleShzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5waWVjZUxheWVyLnJlbW92ZVBpZWNlQnlTcXVhcmVLZXkoc3F1YXJlS2V5KTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFNvdXJjZShmcm9tOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5ib2FyZExheWVyLmhpZ2hsaWdodFNvdXJjZShmcm9tKTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFRhcmdldCh0bzpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5oaWdobGlnaHRUYXJnZXQodG8pO1xyXG4gICAgfVxyXG4gICAgY2xlYXJTb3VyY2VBbmRUYXJnZXRIaWdobGlnaHRzKCl7XHJcbiAgICAgICAgdGhpcy5ib2FyZExheWVyLmNsZWFyU291cmNlQW5kVGFyZ2V0SGlnaGxpZ2h0cygpO1xyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0U291cmNlQW5kVGFyZ2V0KGZyb206c3RyaW5nLCB0bzpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5oaWdobGlnaHRTb3VyY2VBbmRUYXJnZXQoZnJvbSwgdG8pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBTaGFyZWQgZnJvbSBcIi4uL1NoYXJlZFwiO1xyXG5cclxuaW50ZXJmYWNlIEFycm93IHtcclxuICAgIGZyb206c3RyaW5nLFxyXG4gICAgdG86c3RyaW5nXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJyb3dMYXllcntcclxuICAgIHByaXZhdGUgc3ZnUm9vdDpTVkdTVkdFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBncm91cDpTVkdHRWxlbWVudDtcclxuICAgIHByaXZhdGUgc3Ryb2tlV2lkdGggPSAyMDtcclxuICAgIHByaXZhdGUgcmlnaHRDbGlja2VkU3F1YXJlS2V5OnN0cmluZ3xudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgaXNSb3RhdGVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRBcnJvd3M6IEFycm93W10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QgPSBzdmdSb290O1xyXG4gICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHN2Z1Jvb3QuYXBwZW5kQ2hpbGQoZ3JvdXApO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgIH1cclxuICAgIHJvdGF0ZShpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5ncm91cC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFycm93cy5mb3JFYWNoKGFycm93ID0+e1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdBcnJvdyhhcnJvdy5mcm9tLCBhcnJvdy50byk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIG9uUmlnaHRCdXR0b25Eb3duKHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ID0gc3F1YXJlS2V5O1xyXG4gICAgfVxyXG4gICAgb25MZWZ0QnV0dG9uRG93bigpe1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRBcnJvd3MgPSBbXTtcclxuICAgIH1cclxuICAgIG9uUmlnaHRCdXR0b25VcChzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgJiYgdGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgIT09IHNxdWFyZUtleSl7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Fycm93KHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5LCBzcXVhcmVLZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZHJhd0Fycm93KGZyb21TcXVhcmU6c3RyaW5nLCB0b1NxdWFyZTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFycm93cy5wdXNoKHtmcm9tOmZyb21TcXVhcmUsIHRvOnRvU3F1YXJlfSk7XHJcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncG9seWdvbicpO1xyXG4gICAgICAgIGxldCBwb2ludDEgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQyID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50MyA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDQgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQ1ID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50NiA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDcgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuXHJcbiAgICAgICAgbGV0IGZyb20gPSB0aGlzLmdldFJlbGF0aXZlQ2VudGVyKGZyb21TcXVhcmUpO1xyXG4gICAgICAgIGxldCB0byA9IHRoaXMuZ2V0UmVsYXRpdmVDZW50ZXIodG9TcXVhcmUpO1xyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0by54IC0gZnJvbS54LCAyKSArIE1hdGgucG93KHRvLnkgLWZyb20ueSwgMikpO1xyXG4gICAgICAgIGxldCBzaG9ydGVuRGlzdGFuY2UgPSAzMDtcclxuICAgICAgICBsZXQgY2VudGVyID0geyB4OiAoZnJvbS54ICsgdG8ueCkvMiwgeTogKGZyb20ueSArIHRvLnkpLzIgfTtcclxuICAgICAgICBsZXQgdHJpYW5nbGVTaWRlTGVuZ3RoID0gNDA7XHJcbiAgICAgICAgbGV0IGEgPSB0cmlhbmdsZVNpZGVMZW5ndGggLyAyO1xyXG4gICAgICAgIGxldCBjID0gdHJpYW5nbGVTaWRlTGVuZ3RoO1xyXG4gICAgICAgIGxldCBoZWlnaHRPZlRyaWFuZ2xlID0gTWF0aC5zcXJ0KE1hdGgucG93KGMsIDIpIC0gTWF0aC5wb3coYSwyKSk7XHJcblxyXG4gICAgICAgIHBvaW50MS54ID0gY2VudGVyLnggLSAoZGlzdGFuY2UgLyAyKSArIHNob3J0ZW5EaXN0YW5jZTtcclxuICAgICAgICBwb2ludDEueSA9IGNlbnRlci55IC0gdGhpcy5zdHJva2VXaWR0aCAvIDI7XHJcblxyXG4gICAgICAgIHBvaW50Mi54ID0gcG9pbnQxLng7XHJcbiAgICAgICAgcG9pbnQyLnkgPSBwb2ludDEueSArIHRoaXMuc3Ryb2tlV2lkdGg7XHJcblxyXG4gICAgICAgIHBvaW50My54ID0gcG9pbnQyLnggKyBkaXN0YW5jZSAtIGhlaWdodE9mVHJpYW5nbGUgLSBzaG9ydGVuRGlzdGFuY2U7XHJcbiAgICAgICAgcG9pbnQzLnkgPSBwb2ludDIueTtcclxuXHJcbiAgICAgICAgcG9pbnQ0LnggPSBwb2ludDMueDtcclxuICAgICAgICBwb2ludDQueSA9IHBvaW50My55ICsgKCh0cmlhbmdsZVNpZGVMZW5ndGggLyAyKSAtICh0aGlzLnN0cm9rZVdpZHRoIC8gMikpO1xyXG5cclxuICAgICAgICBwb2ludDUueCA9IHBvaW50NC54ICsgaGVpZ2h0T2ZUcmlhbmdsZTtcclxuICAgICAgICBwb2ludDUueSA9IGNlbnRlci55O1xyXG5cclxuICAgICAgICBwb2ludDYueCA9IHBvaW50NC54O1xyXG4gICAgICAgIHBvaW50Ni55ID0gcG9pbnQ0LnkgLSB0cmlhbmdsZVNpZGVMZW5ndGg7XHJcblxyXG4gICAgICAgIHBvaW50Ny54ID0gcG9pbnQzLng7XHJcbiAgICAgICAgcG9pbnQ3LnkgPSBwb2ludDMueSAtIHRoaXMuc3Ryb2tlV2lkdGg7XHJcblxyXG4gICAgICAgIGxldCBkZWx0YVggPSB0by54IC0gZnJvbS54O1xyXG4gICAgICAgIGxldCBkZWx0YVkgPSB0by55IC0gZnJvbS55O1xyXG5cclxuICAgICAgICBsZXQgcmFkaWFuID0gTWF0aC5hdGFuMihkZWx0YVksIGRlbHRhWCk7XHJcbiAgICAgICAgbGV0IGRlZ3JlZXMgPSByYWRpYW4gKiAxODAgLyBNYXRoLlBJO1xyXG5cclxuICAgICAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgXCJyb3RhdGUoXCIgKyBkZWdyZWVzICsgXCIgXCIgKyBjZW50ZXIueC50b1N0cmluZygpICsgXCIgXCIgKyBjZW50ZXIueS50b1N0cmluZygpICsgXCIpXCIpO1xyXG4gICAgICAgIHBvbHlnb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhcnJvd1wiKTtcclxuICAgICAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZ2JhKDI1NSwgMTcwLCAwLCAwLjgpXCIpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQxKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50Mik7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDMpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQ0KTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50NSk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDYpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQ3KTtcclxuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHBvbHlnb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRSZWxhdGl2ZUNlbnRlcihzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBsZXQgY2hhciA9IHNxdWFyZUtleVswXTtcclxuICAgICAgICBsZXQgZGlnaXQgPSBzcXVhcmVLZXlbMV07XHJcbiAgICAgICAgbGV0IHggPSBTaGFyZWQuZ2V0SG9yaXpvbnRhbEluZGV4KGNoYXIsIHRoaXMuaXNSb3RhdGVkKSAqIDEwMCArIDUwO1xyXG4gICAgICAgIGxldCB5ID0gU2hhcmVkLmdldFZlcnRpY2FsSW5kZXgoZGlnaXQsIHRoaXMuaXNSb3RhdGVkKSAqIDEwMCArIDUwO1xyXG4gICAgICAgIHJldHVybiB7IHgsIHkgfTtcclxuICAgIH1cclxufSIsImltcG9ydCBTVkdTcXVhcmUgZnJvbSBcIi4uL1NxdWFyZUZhY3RvcnlcIjtcclxuaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi4vU2hhcmVkXCI7XHJcblxyXG5pbnRlcmZhY2UgSGlnaGxpZ2h0e1xyXG4gICAgc3F1YXJlS2V5OnN0cmluZyxcclxuICAgIHR5cGU6c3RyaW5nO1xyXG4gICAgcmVjdDpTVkdSZWN0RWxlbWVudDtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2FyZExheWVye1xyXG4gICAgcHJpdmF0ZSBzdmdSb290OlNWR1NWR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGlzUm90YXRlZDpib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBzb3VyY2VIaWdobGlnaHQ6SGlnaGxpZ2h0O1xyXG4gICAgcHJpdmF0ZSB0YXJnZXRIaWdobGlnaHQ6SGlnaGxpZ2h0O1xyXG4gICAgcHJpdmF0ZSBzb3VyY2VUYXJnZXRHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHByaXZhdGUgc291cmNlQ29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDUxLCAwLjMpXCI7XHJcbiAgICBwcml2YXRlIHRhcmdldENvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCA1MSwgMC40KVwiO1xyXG4gICAgcHJpdmF0ZSByaWdodENsaWNrQ29sb3IgPSBcInJnYigyMzUsIDk3LCA4MCwgMC44KVwiO1xyXG4gICAgcHJpdmF0ZSByaWdodENsaWNrR3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJpZ2h0Q2xpY2tzOlJlY29yZDxzdHJpbmcsIEhpZ2hsaWdodHxudWxsPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSByaWdodENsaWNrZWRTcXVhcmVLZXk6c3RyaW5nfG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudCwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdCA9IHN2Z1Jvb3Q7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcblxyXG4gICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hcHBlbmRDaGlsZChncm91cCk7XHJcblxyXG4gICAgICAgIGxldCBjb2xvcnMgPSBbXCJsXCIsIFwiZFwiLCBcImxcIiwgXCJkXCIsIFwibFwiLCBcImRcIiwgXCJsXCIsIFwiZFwiXTtcclxuXHJcbiAgICAgICAgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddLmZvckVhY2goeSA9PntcclxuICAgICAgICAgICAgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddLmZvckVhY2goKHgsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQm9hcmRSZWN0KHgsIHksIGNvbG9yc1tpbmRleF0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbG9ycyA9IGNvbG9ycy5yZXZlcnNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VUYXJnZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hcHBlbmRDaGlsZCh0aGlzLnNvdXJjZVRhcmdldEdyb3VwKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNvdXJjZUhpZ2hsaWdodCA9IHtzcXVhcmVLZXk6IFwiYThcIiwgdHlwZTogXCJzb3VyY2VcIiwgcmVjdDogU1ZHU3F1YXJlLmNyZWF0ZVJlY3QoMCwwKX07XHJcbiAgICAgICAgdGhpcy50YXJnZXRIaWdobGlnaHQgPSB7c3F1YXJlS2V5OiBcImE3XCIsIHR5cGU6IFwidGFyZ2V0XCIsIHJlY3Q6IFNWR1NxdWFyZS5jcmVhdGVSZWN0KDEsMCl9O1xyXG4gICAgICAgIHRoaXMuc291cmNlSGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0SGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpO1xyXG4gICAgICAgIHRoaXMuc291cmNlVGFyZ2V0R3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VIaWdobGlnaHQucmVjdCk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VUYXJnZXRHcm91cC5hcHBlbmRDaGlsZCh0aGlzLnRhcmdldEhpZ2hsaWdodC5yZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy5yaWdodENsaWNrR3JvdXApO1xyXG4gICAgfVxyXG4gICAgb25MZWZ0QnV0dG9uRG93bigpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJBbGxIaWdobGlnaHRzKCk7XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSA9IHNxdWFyZUtleTtcclxuICAgIH1cclxuICAgIG9uUmlnaHRCdXR0b25VcChzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgJiYgdGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgPT09IHNxdWFyZUtleSl7XHJcbiAgICAgICAgICAgIGxldCByaWdodENsaWNrZWQgPSB0aGlzLnJpZ2h0Q2xpY2tzW3NxdWFyZUtleV07XHJcbiAgICAgICAgICAgIGlmIChyaWdodENsaWNrZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodENsaWNrR3JvdXAucmVtb3ZlQ2hpbGQocmlnaHRDbGlja2VkLnJlY3QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodENsaWNrc1tzcXVhcmVLZXldID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSaWdodENsaWNrSGlnaGxpZ2h0KHNxdWFyZUtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5zb3VyY2VIaWdobGlnaHQpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy50YXJnZXRIaWdobGlnaHQpO1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5yaWdodENsaWNrcykuZm9yRWFjaChyaWdodENsaWNrID0+e1xyXG4gICAgICAgICAgICBpZiAocmlnaHRDbGljayl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHJpZ2h0Q2xpY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHRTb3VyY2VBbmRUYXJnZXQoZnJvbTpzdHJpbmcsIHRvOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5jbGVhckFsbEhpZ2hsaWdodHMoKTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFNvdXJjZShmcm9tKTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFRhcmdldCh0byk7XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHRTb3VyY2UoZnJvbTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuc291cmNlSGlnaGxpZ2h0LnNxdWFyZUtleSA9IGZyb207XHJcbiAgICAgICAgdGhpcy5zb3VyY2VIaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuc291cmNlQ29sb3IpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5zb3VyY2VIaWdobGlnaHQpO1xyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0VGFyZ2V0KHRvOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy50YXJnZXRIaWdobGlnaHQuc3F1YXJlS2V5ID0gdG87XHJcbiAgICAgICAgdGhpcy50YXJnZXRIaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMudGFyZ2V0Q29sb3IpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy50YXJnZXRIaWdobGlnaHQpO1xyXG4gICAgfVxyXG4gICAgY2xlYXJTb3VyY2VBbmRUYXJnZXRIaWdobGlnaHRzKCl7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VIaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwidHJhbnNwYXJlbnRcIik7XHJcbiAgICAgICAgdGhpcy50YXJnZXRIaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwidHJhbnNwYXJlbnRcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNob3dUYXJnZXRPclNvdXJjZShzcXVhcmVLZXk6c3RyaW5nLCBoaWdobGlnaHQ6SGlnaGxpZ2h0LCBjb2xvcjpzdHJpbmcpe1xyXG4gICAgICAgIGhpZ2hsaWdodC5zcXVhcmVLZXkgPSBzcXVhcmVLZXk7XHJcbiAgICAgICAgaGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbihoaWdobGlnaHQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjbGVhckFsbEhpZ2hsaWdodHMoKXtcclxuICAgICAgICB0aGlzLmNsZWFyU291cmNlQW5kVGFyZ2V0SGlnaGxpZ2h0cygpO1xyXG4gICAgICAgIHRoaXMucmlnaHRDbGlja3MgPSB7fTtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tHcm91cC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVSaWdodENsaWNrSGlnaGxpZ2h0KHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBjb3JkcyA9IFNoYXJlZC5nZXRDb3JkaW5hdGVzQnlTcXVhcmVLZXkoc3F1YXJlS2V5LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBTVkdTcXVhcmUuY3JlYXRlUmVjdChjb3Jkcy54LCBjb3Jkcy55KTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy5yaWdodENsaWNrQ29sb3IpO1xyXG4gICAgICAgIHRoaXMucmlnaHRDbGlja0dyb3VwLmFwcGVuZENoaWxkKHJlY3QpO1xyXG4gICAgICAgIHRoaXMucmlnaHRDbGlja3Nbc3F1YXJlS2V5XSA9IHtzcXVhcmVLZXksIHR5cGU6IFwiUmlnaHRDbGlja1wiLCByZWN0fTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UG9zaXRpb24oaGlnaGxpZ2h0OkhpZ2hsaWdodCl7XHJcbiAgICAgICAgbGV0IGNvcmQgPSBTaGFyZWQuZ2V0Q29yZGluYXRlc0J5U3F1YXJlS2V5KGhpZ2hsaWdodC5zcXVhcmVLZXksIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICBoaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIChjb3JkLnggKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgKGNvcmQueSAqIDEwMCkudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUJvYXJkUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIGNvbG9yOnN0cmluZyl7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBTVkdTcXVhcmUuY3JlYXRlUmVjdCh4LCB5KTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgY29sb3IgPT09IFwibFwiID8gXCJyZ2IoMjMzLDIzNywyMDQpXCIgOiBcInJnYigxMTksMTUzLDg0KVwiKTtcclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcmRzTGF5ZXJ7XHJcbiAgICBwcml2YXRlIGdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBob3Jpem9udGFsR3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHZlcnRpY2FsR3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGlzUm90YXRlZDpib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudCwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwiSGVsdmV0aWNhXCIpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlKFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInJnYigzMCwzMCwzMFwiKTtcclxuICAgICAgICBzdmdSb290LmFwcGVuZCh0aGlzLmdyb3VwKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICB0aGlzLnZlcnRpY2FsR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZCh0aGlzLmhvcml6b250YWxHcm91cCk7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZCh0aGlzLnZlcnRpY2FsR3JvdXApO1xyXG5cclxuICAgICAgICB0aGlzLmhvcml6b250YWxHcm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoODYsIDc5NS41KVwiKTtcclxuICAgICAgICB0aGlzLnZlcnRpY2FsR3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDUsIDE4KVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRIb3Jpem9udGFsQ29yZHMoaXNSb3RhdGVkKS5mb3JFYWNoKChsZXR0ZXIsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgICAgIGdyb3VwLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChpbmRleCAqIDEwMCkudG9TdHJpbmcoKSArIFwiLDApXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmhvcml6b250YWxHcm91cC5hcHBlbmRDaGlsZChncm91cCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInNjYWxlKDAuOSlcIik7XHJcbiAgICAgICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBsZXR0ZXI7XHJcbiAgICAgICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2V0VmVydGljYWxDb3Jkcyhpc1JvdGF0ZWQpLmZvckVhY2goKG51bWJlciwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICAgICAgZ3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyArIChpbmRleCAqIDEwMCkudG9TdHJpbmcoKSArIFwiKVwiKTtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbEdyb3VwLmFwcGVuZENoaWxkKGdyb3VwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcInRleHRcIik7XHJcbiAgICAgICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBudW1iZXI7XHJcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwic2NhbGUoMSlcIik7XHJcbiAgICAgICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRIb3Jpem9udGFsQ29yZHMoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBob3Jpem9udGFsQ29yZHMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCIsIFwiSFwiXTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gaG9yaXpvbnRhbENvcmRzLnJldmVyc2UoKSA6IGhvcml6b250YWxDb3JkcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VmVydGljYWxDb3Jkcyhpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IHZlcnRpY2FsQ29yZHMgPSBbXCI4XCIsIFwiN1wiLCBcIjZcIiwgXCI1XCIsIFwiNFwiLCBcIjNcIiwgXCIyXCIsIFwiMVwiXTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gdmVydGljYWxDb3Jkcy5yZXZlcnNlKCkgOiB2ZXJ0aWNhbENvcmRzO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICBsZXQgbGV0dGVycyA9IHRoaXMuZ2V0SG9yaXpvbnRhbENvcmRzKGlzUm90YXRlZCk7XHJcbiAgICAgICAgbGV0IG51bWJlcnMgPSB0aGlzLmdldFZlcnRpY2FsQ29yZHMoaXNSb3RhdGVkKTtcclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMuaG9yaXpvbnRhbEdyb3VwLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBjaGlsZC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGxldHRlcnNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIEFycmF5LmZyb20odGhpcy52ZXJ0aWNhbEdyb3VwLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBjaGlsZC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IG51bWJlcnNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBpZWNlIGZyb20gXCIuLi9QaWVjZVwiO1xyXG5pbXBvcnQgUGllY2VGYWN0b3J5IGZyb20gXCIuLi9QaWVjZUZhY3RvcnlcIjtcclxuaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi4vU2hhcmVkXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVjZUxheWVye1xyXG4gICAgcHJpdmF0ZSBncm91cDpTVkdHRWxlbWVudDtcclxuICAgIHByaXZhdGUgaXNSb3RhdGVkOmJvb2xlYW47XHJcbiAgICBwcml2YXRlIHBvc2l0aW9uczpSZWNvcmQ8c3RyaW5nLCBQaWVjZXx1bmRlZmluZWQ+ID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50LCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHN2Z1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy5ncm91cCk7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0ge307XHJcbiAgICAgICAgdGhpcy5ncm91cC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgZ2V0UGllY2Uoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb25zW3NxdWFyZUtleV07XHJcbiAgICB9XHJcbiAgICBhZGRQaWVjZShmZW5DaGFyOnN0cmluZywgc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgbGV0IHBpZWNlID0gUGllY2VGYWN0b3J5LmdldChmZW5DaGFyLCBzcXVhcmVLZXkpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQocGllY2UuZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbihwaWVjZSk7XHJcbiAgICAgICAgcmV0dXJuIHBpZWNlO1xyXG4gICAgfVxyXG4gICAgdW5kb1BpZWNlUmVtb3ZhbChwaWVjZTpQaWVjZSl7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChwaWVjZS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHBpZWNlKTtcclxuICAgIH1cclxuICAgIHJlbW92ZVBpZWNlQnlTcXVhcmVLZXkoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgbGV0IHBpZWNlID0gdGhpcy5wb3NpdGlvbnNbc3F1YXJlS2V5XSE7XHJcbiAgICAgICAgdGhpcy5ncm91cC5yZW1vdmVDaGlsZChwaWVjZS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uc1tzcXVhcmVLZXldID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBwaWVjZTtcclxuICAgIH1cclxuICAgIHJvdGF0ZShpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgbGV0IHBpZWNlcyA9IE9iamVjdC52YWx1ZXModGhpcy5wb3NpdGlvbnMpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0ge307XHJcbiAgICAgICAgcGllY2VzLmZvckVhY2gocGllY2UgPT57XHJcbiAgICAgICAgICAgIGlmIChwaWVjZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHBpZWNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2V0UG9zaXRpb24ocGllY2U6UGllY2Upe1xyXG4gICAgICAgIGxldCBzcXVhcmVLZXkgPSBwaWVjZS5zcXVhcmVLZXkhO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zW3NxdWFyZUtleV0gPSBwaWVjZTtcclxuICAgICAgICBTaGFyZWQuc2V0UG9zaXRpb24ocGllY2UuZWxlbWVudCwgc3F1YXJlS2V5LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQm9hcmRMYXllciBmcm9tIFwiLi9MYXllcnMvQm9hcmRMYXllclwiO1xyXG5pbXBvcnQgQXJyb3dMYXllciBmcm9tIFwiLi9MYXllcnMvQXJyb3dMYXllclwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuL1NoYXJlZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW91c2VFdmVudHN7XHJcbiAgICBzdmdSb290OlNWR1NWR0VsZW1lbnQ7XHJcbiAgICBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGJvYXJkTGF5ZXI6Qm9hcmRMYXllciwgYXJyb3dMYXllcjpBcnJvd0xheWVyLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gc3ZnUm9vdDtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuXHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGV2ZW50Ok1vdXNlRXZlbnQpID0+IFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGlzUmlnaHRDbGljayA9IGV2ZW50LmJ1dHRvbiAmJiBldmVudC5idXR0b24gPT0gMjtcclxuICAgICAgICAgICAgaWYgKGlzUmlnaHRDbGljayl7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3F1YXJlS2V5ID0gU2hhcmVkLmdldFNxdWFyZUJ5Q3Vyc29yUG9zaXRpb24odGhpcy5zdmdSb290LCBldmVudCwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYm9hcmRMYXllci5vblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICAgICAgYXJyb3dMYXllci5vblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBib2FyZExheWVyLm9uTGVmdEJ1dHRvbkRvd24oKTtcclxuICAgICAgICAgICAgICAgIGFycm93TGF5ZXIub25MZWZ0QnV0dG9uRG93bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmIChpc1JpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgbGV0IHNxdWFyZUtleSA9IFNoYXJlZC5nZXRTcXVhcmVCeUN1cnNvclBvc2l0aW9uKHRoaXMuc3ZnUm9vdCwgZXZlbnQsIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgICAgIGJvYXJkTGF5ZXIub25SaWdodEJ1dHRvblVwKHNxdWFyZUtleSk7XHJcbiAgICAgICAgICAgICAgICBhcnJvd0xheWVyLm9uUmlnaHRCdXR0b25VcChzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpICk7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgYmlzaG9wIGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvYi5qc29uXCI7XHJcbmltcG9ydCAqIGFzIGtpbmcgZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9rLmpzb25cIjtcclxuaW1wb3J0ICogYXMga25pZ2h0IGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvbi5qc29uXCI7XHJcbmltcG9ydCAqIGFzIHBhd24gZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9wLmpzb25cIjtcclxuaW1wb3J0ICogYXMgcXVlZW4gZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9xLmpzb25cIjtcclxuaW1wb3J0ICogYXMgcm9vayBmcm9tIFwiLi9hc3NldHMvcGllY2VzL3IuanNvblwiO1xyXG5cclxuY29uc3QgcGllY2VTVkdEYXRhOlJlY29yZDxzdHJpbmcsIEdyb3VwPiA9IHt9O1xyXG5waWVjZVNWR0RhdGFbXCJwXCJdID0gcGF3bi5nIGFzIEdyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJyXCJdID0gcm9vay5nIGFzIEdyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJuXCJdID0ga25pZ2h0LmcgYXMgR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcImJcIl0gPSBiaXNob3AuZyBhcyBHcm91cDtcclxucGllY2VTVkdEYXRhW1wicVwiXSA9IHF1ZWVuLmcgYXMgR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcImtcIl0gPSBraW5nLmcgYXMgR3JvdXA7XHJcblxyXG5pbnRlcmZhY2UgR3JvdXB7XHJcbiAgICBnOiBHcm91cHx1bmRlZmluZWQ7XHJcbiAgICB0cmFuc2Zvcm06c3RyaW5nfHVuZGVmaW5lZDtcclxuICAgIHN0eWxlOnN0cmluZ1tdfHVuZGVmaW5lZDtcclxuICAgIHBhdGg6UGF0aFtdfHVuZGVmaW5lZHxudWxsO1xyXG4gICAgY2lyY2xlOkNpcmNsZVtdfHVuZGVmaW5lZDtcclxufVxyXG5pbnRlcmZhY2UgUGF0aHtcclxuICAgIHN0eWxlOnN0cmluZ1tdfHVuZGVmaW5lZDtcclxuICAgIGQ6c3RyaW5nO1xyXG4gICAgY29sb3JJbmRleDpudW1iZXJ8dW5kZWZpbmVkO1xyXG59XHJcbmludGVyZmFjZSBDaXJjbGV7XHJcbiAgICBjeDpzdHJpbmc7XHJcbiAgICBjeTpzdHJpbmc7XHJcbiAgICByOnN0cmluZztcclxufVxyXG5jb25zdCBwaWVjZUVsZW1lbnRUeXBlczpSZWNvcmQ8c3RyaW5nLCBTVkdHRWxlbWVudD4gPSB7fTtcclxuW1wicFwiLFwiblwiLFwiYlwiLFwiclwiLFwicVwiLFwia1wiLFwiUFwiLFwiTlwiLFwiQlwiLFwiUlwiLFwiUVwiLFwiS1wiXS5mb3JFYWNoKGZlbkNoYXIgPT57XHJcbiAgICBsZXQgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgbGV0IGRhdGEgPSBwaWVjZVNWR0RhdGFbZmVuQ2hhci50b0xvd2VyQ2FzZSgpXTtcclxuICAgIGxldCBjb2xvciA9IGZlbkNoYXIgPT09IGZlbkNoYXIudG9Mb3dlckNhc2UoKSA/IDAgOiAxO1xyXG4gICAgbG9hZENoaWxkcmVuKGcsIGRhdGEsIGNvbG9yKTtcclxuICAgIHBpZWNlRWxlbWVudFR5cGVzW2ZlbkNoYXJdID0gZztcclxufSk7XHJcbmZ1bmN0aW9uIGxvYWRDaGlsZHJlbihnOlNWR0dFbGVtZW50LCBncm91cDpHcm91cCwgY29sb3I6bnVtYmVyKXtcclxuICAgIGlmIChncm91cC50cmFuc2Zvcm0pe1xyXG4gICAgICAgIGcuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGdyb3VwLnRyYW5zZm9ybSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZ3JvdXAuc3R5bGUgJiYgZ3JvdXAuc3R5bGVbY29sb3JdKXtcclxuICAgICAgICBnLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGdyb3VwLnN0eWxlW2NvbG9yXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZ3JvdXAuY2lyY2xlKXtcclxuICAgICAgICBncm91cC5jaXJjbGUuZm9yRWFjaChjaXJjbGUgPT57XHJcbiAgICAgICAgICAgIGxldCBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdjaXJjbGUnKTtcclxuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjaXJjbGUuY3gpO1xyXG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShcImN5XCIsIGNpcmNsZS5jeSk7XHJcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKFwiclwiLCBjaXJjbGUucik7XHJcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQoYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZ3JvdXAucGF0aCl7XHJcbiAgICAgICAgZ3JvdXAucGF0aC5mb3JFYWNoKHBhdGggPT57XHJcbiAgICAgICAgICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmNvbG9ySW5kZXggPT09IHVuZGVmaW5lZCB8fCBwYXRoLmNvbG9ySW5kZXggPT09IGNvbG9yKXtcclxuICAgICAgICAgICAgICAgIHAuc2V0QXR0cmlidXRlKFwiZFwiLCBwYXRoLmQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGguc3R5bGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHAuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgcGF0aC5zdHlsZVtjb2xvcl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLmcpe1xyXG4gICAgICAgIGxldCBjaGlsZEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgZy5hcHBlbmRDaGlsZChjaGlsZEdyb3VwKTtcclxuICAgICAgICBsb2FkQ2hpbGRyZW4oY2hpbGRHcm91cCwgZ3JvdXAuZywgY29sb3IpO1xyXG4gICAgfVxyXG59XHJcbm5hbWVzcGFjZSBQaWVjZUVsZW1lbnRGYWN0b3J5e1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldChmZW5DaGFyOnN0cmluZyk6U1ZHR0VsZW1lbnR7XHJcbiAgICAgICAgcmV0dXJuIHBpZWNlRWxlbWVudFR5cGVzW2ZlbkNoYXJdLmNsb25lTm9kZSh0cnVlKSBhcyBTVkdHRWxlbWVudDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBQaWVjZUVsZW1lbnRGYWN0b3J5O1xyXG4iLCJpbXBvcnQgUGllY2UgZnJvbSBcIi4vUGllY2VcIjtcclxuaW1wb3J0IFBpZWNlRWxlbWVudEZhY3RvcnkgZnJvbSBcIi4vUGllY2VFbGVtZW50RmFjdG9yeVwiO1xyXG5cclxubmFtZXNwYWNlIFBpZWNlRmFjdG9yeXtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXQoZmVuQ2hhcjpzdHJpbmcsIHNxdWFyZUtleT86c3RyaW5nKXtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IFBpZWNlRWxlbWVudEZhY3RvcnkuZ2V0KGZlbkNoYXIpO1xyXG4gICAgICAgIHJldHVybiB7IGZlbkNoYXIsIGVsZW1lbnQsIHNxdWFyZUtleSB9IGFzIFBpZWNlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFBpZWNlRmFjdG9yeTsiLCJuYW1lc3BhY2UgU2hhcmVke1xyXG4gICAgY29uc3Qgc3F1YXJlS2V5cyA9IFtcImE4XCIsIFwiYjhcIiwgXCJjOFwiLCBcImQ4XCIsIFwiZThcIiwgXCJmOFwiLCBcImc4XCIsIFwiaDhcIiwgXCJhN1wiLCBcImI3XCIsIFwiYzdcIiwgXCJkN1wiLCBcImU3XCIsIFwiZjdcIiwgXCJnN1wiLCBcImg3XCIsIFwiYTZcIiwgXCJiNlwiLCBcImM2XCIsIFwiZDZcIiwgXCJlNlwiLCBcImY2XCIsIFwiZzZcIiwgXCJoNlwiLCBcImE1XCIsIFwiYjVcIiwgXCJjNVwiLCBcImQ1XCIsIFwiZTVcIiwgXCJmNVwiLCBcImc1XCIsIFwiaDVcIiwgXCJhNFwiLCBcImI0XCIsIFwiYzRcIiwgXCJkNFwiLCBcImU0XCIsIFwiZjRcIiwgXCJnNFwiLCBcImg0XCIsIFwiYTNcIiwgXCJiM1wiLCBcImMzXCIsIFwiZDNcIiwgXCJlM1wiLCBcImYzXCIsIFwiZzNcIiwgXCJoM1wiLCBcImEyXCIsIFwiYjJcIiwgXCJjMlwiLCBcImQyXCIsIFwiZTJcIiwgXCJmMlwiLCBcImcyXCIsIFwiaDJcIiwgXCJhMVwiLCBcImIxXCIsIFwiYzFcIiwgXCJkMVwiLCBcImUxXCIsIFwiZjFcIiwgXCJnMVwiLCBcImgxXCJdO1xyXG4gICAgY29uc3QgaG9yaXpvbnRhbCA9IFtcImFcIiwgXCJiXCIsIFwiY1wiLCBcImRcIiwgXCJlXCIsIFwiZlwiLCBcImdcIiwgXCJoXCJdO1xyXG4gICAgY29uc3QgdmVydGljYWwgPSBbXCI4XCIsIFwiN1wiLCBcIjZcIiwgXCI1XCIsIFwiNFwiLCBcIjNcIiwgXCIyXCIsIFwiMVwiXTtcclxuICAgIFxyXG4gICAgZXhwb3J0IGNvbnN0IHN0YXJ0RkVOID0gXCJybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMVwiO1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTcXVhcmVLZXlCeUluZGV4ZXMoaG9yaXpvbnRhbEluZGV4Om51bWJlciwgdmVydGljYWxJbmRleDpudW1iZXIsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgbGV0dGVySW5kZXggPSBpc1JvdGF0ZWQgPyA3IC0gaG9yaXpvbnRhbEluZGV4IDogaG9yaXpvbnRhbEluZGV4O1xyXG4gICAgICAgIGxldCBkaWdpdEluZGV4ID0gaXNSb3RhdGVkID8gNyAtIHZlcnRpY2FsSW5kZXggOiB2ZXJ0aWNhbEluZGV4O1xyXG4gICAgICAgIHJldHVybiBob3Jpem9udGFsW2xldHRlckluZGV4XSArIHZlcnRpY2FsW2RpZ2l0SW5kZXhdO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFNxdWFyZUtleUJ5SW5kZXgoaW5kZXg6bnVtYmVyLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGkgPSBpc1JvdGF0ZWQgPyA2MyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICAgICAgcmV0dXJuIHNxdWFyZUtleXNbaV07XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudEluZGV4T2ZTcXVhcmVLZXkoc3F1YXJlS2V5OnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpbmRleCA9IHNxdWFyZUtleXMuaW5kZXhPZihzcXVhcmVLZXkpO1xyXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQgPyA2MyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0SG9yaXpvbnRhbEluZGV4KHNxdWFyZUxldHRlcjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgaW5kZXggPSBob3Jpem9udGFsLmluZGV4T2Yoc3F1YXJlTGV0dGVyKTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0VmVydGljYWxJbmRleChzcXVhcmVOdW1iZXI6c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdmVydGljYWwuaW5kZXhPZihzcXVhcmVOdW1iZXIpO1xyXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQgPyA3IC0gaW5kZXggOiBpbmRleDtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDb3JkaW5hdGVzQnlTcXVhcmVLZXkoc3F1YXJlS2V5OnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCB4ID0gZ2V0SG9yaXpvbnRhbEluZGV4KHNxdWFyZUtleVswXSwgaXNSb3RhdGVkKTtcclxuICAgICAgICBsZXQgeSA9IGdldFZlcnRpY2FsSW5kZXgoc3F1YXJlS2V5WzFdLCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHJldHVybiB7IHgsIHkgfTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBzZXRQb3NpdGlvbihlbGVtZW50OlNWR0dFbGVtZW50LCBzcXVhcmVLZXk6c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGNvcmRzID0gZ2V0Q29yZGluYXRlc0J5U3F1YXJlS2V5KHNxdWFyZUtleSwgaXNSb3RhdGVkKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIGNvcmRzLnggKiAxMDAgKyBcIixcIiArIGNvcmRzLnkgKiAxMDAgKyBcIilcIik7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3F1YXJlQnlDdXJzb3JQb3NpdGlvbihib2FyZFNWRzpTVkdTVkdFbGVtZW50LCBldmVudDpNb3VzZUV2ZW50LCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IHN2Z1BhcmVudCA9IGJvYXJkU1ZHLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgbGV0IGJvYXJkV2lkdGhBbmRIZWlnaHQgPSBzdmdQYXJlbnQuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgbGV0IHNxdWFyZVdpZHRoQW5kSGVpZ2h0ID0gYm9hcmRXaWR0aEFuZEhlaWdodCAvIDg7XHJcbiAgICAgICAgbGV0IGJvYXJkQ29vcmRpbmF0ZVggPSBldmVudC5jbGllbnRYIC0gc3ZnUGFyZW50Lm9mZnNldExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICBsZXQgYm9hcmRDb29yZGluYXRlWSA9IGV2ZW50LmNsaWVudFkgLSBzdmdQYXJlbnQub2Zmc2V0VG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgICAgICBsZXQgc3F1YXJlSW5kZXhYPSBNYXRoLmZsb29yKGJvYXJkQ29vcmRpbmF0ZVggLyBzcXVhcmVXaWR0aEFuZEhlaWdodCk7XHJcbiAgICAgICAgbGV0IHNxdWFyZUluZGV4WSA9IE1hdGguZmxvb3IoYm9hcmRDb29yZGluYXRlWSAvIHNxdWFyZVdpZHRoQW5kSGVpZ2h0KTtcclxuICAgICAgICByZXR1cm4gZ2V0U3F1YXJlS2V5QnlJbmRleGVzKHNxdWFyZUluZGV4WCwgc3F1YXJlSW5kZXhZLCBpc1JvdGF0ZWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFNoYXJlZDtcclxuIiwibmFtZXNwYWNlIFNWR1NxdWFyZXtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZWN0KHg6bnVtYmVyLCB5Om51bWJlcil7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInhcIiwgKHggKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCAoeSAqIDEwMCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjEwMFwiKTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBcIjEwMFwiKTtcclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTVkdTcXVhcmUiLCJpbXBvcnQgUGllY2VFbGVtZW50RmFjdG9yeSBmcm9tIFwiLi4vY2hlc3Nib2FyZC9QaWVjZUVsZW1lbnRGYWN0b3J5XCI7XHJcblxyXG5jb25zdCBwaWVjZVR5cGVzOiBSZWNvcmQ8c3RyaW5nLCBTVkdTVkdFbGVtZW50PiA9IHt9O1xyXG5cclxuW1wicFwiLFwiblwiLFwiYlwiLFwiclwiLFwicVwiLFwiUFwiLFwiTlwiLFwiQlwiLFwiUlwiLFwiUVwiXS5mb3JFYWNoKGZlbkNoYXIgPT57XHJcbiAgICBsZXQgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcInN2Z1wiKTtcclxuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDEwMCAxMDAnKTtcclxuICAgIGxldCBwaWVjZSA9IFBpZWNlRWxlbWVudEZhY3RvcnkuZ2V0KGZlbkNoYXIpO1xyXG4gICAgc3ZnLmFwcGVuZENoaWxkKHBpZWNlKTtcclxuICAgIHBpZWNlVHlwZXNbZmVuQ2hhcl0gPSBzdmcgYXMgU1ZHU1ZHRWxlbWVudDtcclxufSk7XHJcbmV4cG9ydCBuYW1lc3BhY2UgQ2FwdHVyZVBpZWNlRmFjdG9yeXtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXQoZmVuQ2hhcjpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBwaWVjZVR5cGVzW2ZlbkNoYXJdLmNsb25lTm9kZSh0cnVlKSBhcyBTVkdTVkdFbGVtZW50O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuIiwiaW1wb3J0IENoZXNzYm9hcmQgZnJvbSBcIi4uL2NoZXNzYm9hcmQvQ2hlc3Nib2FyZFwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuLi9jaGVzc2JvYXJkL1NoYXJlZFwiO1xyXG5pbXBvcnQgeyBNb3ZlIH0gZnJvbSBcImNoZXNzLmpzXCI7XHJcbmltcG9ydCBQbGF5ZXJJbmZvIGZyb20gXCIuL1BsYXllckluZm9cIjtcclxuaW1wb3J0IEdhbWUgZnJvbSBcIi4vR2FtZVwiO1xyXG5pbXBvcnQgVHJhbnNpdGlvbiBmcm9tIFwiLi9UcmFuc2l0aW9uXCI7XHJcbmltcG9ydCBcIi4vZ2FtZUJyb3dzZXIuY3NzXCI7XHJcbmltcG9ydCBUcmFuc2l0aW9uTGF5ZXIgZnJvbSBcIi4vVHJhbnNpdGlvbkxheWVyXCI7XHJcbmltcG9ydCBQaWVjZUVsZW1lbnRGYWN0b3J5IGZyb20gXCIuLi9jaGVzc2JvYXJkL1BpZWNlRmFjdG9yeVwiO1xyXG5pbXBvcnQgUGllY2VGYWN0b3J5IGZyb20gXCIuLi9jaGVzc2JvYXJkL1BpZWNlRmFjdG9yeVwiO1xyXG5cclxudHlwZSBTdGF0ZSA9IFwic3RhcnRcIiB8IFwicmV3aW5kXCIgfCBcInByZXZpb3VzXCIgfCBcInBsYXlcIiB8IFwicGF1c2VcIiB8IFwibmV4dFwiIHwgXCJmb3J3YXJkXCIgfCBcImVuZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUJyb3dzZXJ7XHJcbiAgICBjaGVzc2JvYXJkOkNoZXNzYm9hcmQ7XHJcbiAgICBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuICAgIHBsYXllckluZm86UGxheWVySW5mbztcclxuICAgIG1vdmVzOk1vdmVbXSA9IFtdO1xyXG4gICAgY3VycmVudE1vdmVJbmRleCA9IDA7XHJcbiAgICB0cmFuc2l0aW9uTGF5ZXI6VHJhbnNpdGlvbkxheWVyO1xyXG4gICAgc3RhdGU6U3RhdGUgPSBcInN0YXJ0XCI7XHJcbiAgICBzaG9ydERlbGF5QmV0d2Vlbk1vdmVzID0gMjAwO1xyXG4gICAgbG9uZ0RlbGF5QmV0d2Vlbk1vdmVzID0gMTAwMDtcclxuICAgIHNob3J0VHJhbnNpdGlvbkR1cmF0aW9uID0gXCIxMDAwbXNcIjtcclxuICAgIGxvbmdUcmFuc2l0aW9uRHVyYXRpb24gPSBcIjIwMDBtc1wiO1xyXG4gICAgdGltZW91dElkOk5vZGVKUy5UaW1lb3V0fHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6SFRNTEVsZW1lbnQsIGZlbjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQgPSBuZXcgQ2hlc3Nib2FyZChjb250YWluZXIsIGZlbiwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgUGxheWVySW5mbyhjb250YWluZXIsIGZlbiwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25MYXllciA9IG5ldyBUcmFuc2l0aW9uTGF5ZXIodGhpcy5jaGVzc2JvYXJkLnN2Z1Jvb3QsIGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgLy8gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuZ29Ub01vdmUoNyk7XHJcbiAgICAgICAgLy8gfSwgMTApO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKCl7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSAhdGhpcy5pc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnJvdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucGxheWVySW5mby5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25MYXllci5jdXJyZW50VHJhbnNpdGlvbil7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkxheWVyLmNhbmNlbFRyYW5zaXRpb24oXCJyb3RhdGVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkxheWVyLnJvdGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgbG9hZEdhbWUoZ2FtZTpHYW1lKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0RmVuKFNoYXJlZC5zdGFydEZFTiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJbmZvLnNldFBsYXllck5hbWVzKGdhbWUuYmxhY2tQbGF5ZXIsIGdhbWUud2hpdGVQbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMucGxheWVySW5mby5zZXRTY29yZUFuZENhcHV0ZXJlQnlGZW4oU2hhcmVkLnN0YXJ0RkVOKTtcclxuICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICB0aGlzLmN1cnJlbnRNb3ZlSW5kZXggPSAtMTtcclxuICAgIH1cclxuICAgIHJld2luZCgpe1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInJld2luZFwiO1xyXG4gICAgICAgIHRoaXMubW92ZUJhY2soKTtcclxuICAgIH1cclxuICAgIHByZXZpb3VzKCl7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwicGF1c2VcIjtcclxuICAgICAgICB0aGlzLm1vdmVCYWNrKCk7XHJcbiAgICB9XHJcbiAgICBwbGF5KCl7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwicGxheVwiO1xyXG4gICAgICAgIHRoaXMubW92ZUZvcndhcmQoKTtcclxuICAgIH1cclxuICAgIHBhdXNlKCl7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwicGF1c2VcIjtcclxuICAgIH1cclxuICAgIG5leHQoKXtcclxuICAgICAgICB0aGlzLnN0YXRlID0gXCJwYXVzZVwiO1xyXG4gICAgICAgIHRoaXMubW92ZUZvcndhcmQoKTtcclxuICAgIH1cclxuICAgIGZvcndhcmQoKXtcclxuICAgICAgICB0aGlzLnN0YXRlID0gXCJmb3J3YXJkXCI7XHJcbiAgICAgICAgdGhpcy5tb3ZlRm9yd2FyZCgpO1xyXG4gICAgfVxyXG4gICAgZ29Ub01vdmUoaW5kZXg6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRNb3ZlSW5kZXggPSBpbmRleDtcclxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwic3RhcnRcIjtcclxuICAgICAgICAgICAgbGV0IG1vdmUgPSB0aGlzLm1vdmVzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0RmVuKG1vdmUuYmVmb3JlLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmNsZWFyU291cmNlQW5kVGFyZ2V0SGlnaGxpZ2h0cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IHRoaXMubW92ZXMubGVuZ3RoIC0xKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcImVuZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJwYXVzZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBtb3ZlID0gdGhpcy5tb3Zlc1tpbmRleF07XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5zZXRGZW4obW92ZS5hZnRlciwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVySW5mby5zZXRTY29yZUFuZENhcHV0ZXJlQnlGZW4obW92ZS5hZnRlcik7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5oaWdobGlnaHRTb3VyY2VBbmRUYXJnZXQobW92ZS5mcm9tLCBtb3ZlLnRvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG1vdmVGb3J3YXJkKCl7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uTGF5ZXIuY3VycmVudFRyYW5zaXRpb24pe1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25MYXllci5jYW5jZWxUcmFuc2l0aW9uKFwibW92ZUZvcndhcmRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY3VycmVudE1vdmVJbmRleCA8IHRoaXMubW92ZXMubGVuZ3RoIC0xKXtcclxuICAgICAgICAgICAgbGV0IG1vdmUgPSB0aGlzLm1vdmVzW3RoaXMuY3VycmVudE1vdmVJbmRleCArMV07XHJcbiAgICAgICAgICAgIGxldCBwaWVjZSA9IHRoaXMuY2hlc3Nib2FyZC5yZW1vdmVQaWVjZUJ5U3F1YXJlS2V5KG1vdmUuZnJvbSkhO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0U291cmNlKG1vdmUuZnJvbSk7XHJcbiAgICAgICAgICAgIGxldCBjYXN0bGluZyA9IHRoaXMuZ2V0Q2FzdGxpbmcobW92ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChjYXN0bGluZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0VGFyZ2V0KGNhc3RsaW5nLmZyb20pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB0cmFuc2l0aW9uSW5mbzpUcmFuc2l0aW9uLkluZm8gPSB7XHJcbiAgICAgICAgICAgICAgICBjYW5jZWxSZWFzb246dW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOlwiZm9yd2FyZFwiLCBcclxuICAgICAgICAgICAgICAgIHBpZWNlLFxyXG4gICAgICAgICAgICAgICAgZnJvbTptb3ZlLmZyb20sXHJcbiAgICAgICAgICAgICAgICB0bzptb3ZlLnRvLFxyXG4gICAgICAgICAgICAgICAgY2FzdGxpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZHVyYXRpb24gPSB0aGlzLnN0YXRlID09PSBcInBsYXlcIiA/IHRoaXMubG9uZ1RyYW5zaXRpb25EdXJhdGlvbiA6IHRoaXMuc2hvcnRUcmFuc2l0aW9uRHVyYXRpb247XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkxheWVyLm1vdmUodHJhbnNpdGlvbkluZm8sIGR1cmF0aW9uLCAoKSA9PntcclxuICAgICAgICAgICAgICAgIC8vT25UcmFuc2l0aW9uRW5kXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaE1vdmVGb3J3YXJkKHRyYW5zaXRpb25JbmZvLCBtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sICgpID0+e1xyXG4gICAgICAgICAgICAgICAgLy9PblRyYW5zaXRpb25DYW5jZWxcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uSW5mby5jYW5jZWxSZWFzb24gPT09IFwibW92ZUZvcndhcmRcIiB8fCB0cmFuc2l0aW9uSW5mby5jYW5jZWxSZWFzb24gPT09IFwicm90YXRlXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoTW92ZUZvcndhcmQodHJhbnNpdGlvbkluZm8sIG1vdmUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQudW5kb1BpZWNlUmVtb3ZhbCh0cmFuc2l0aW9uSW5mby5waWVjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25JbmZvLmNhc3RsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnVuZG9QaWVjZVJlbW92YWwodHJhbnNpdGlvbkluZm8uY2FzdGxpbmcucm9vayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5pc2hNb3ZlRm9yd2FyZChpbmZvOlRyYW5zaXRpb24uSW5mbywgbW92ZTpNb3ZlLCBqdW1wVG9OZXh0TW92ZTpib29sZWFuKXtcclxuICAgICAgICBpZiAoaW5mby5jYXN0bGluZyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5wdXRQaWVjZUJhY2tXaXRoTmV3UG9zaXRpb24oaW5mby5jYXN0bGluZy5yb29rLCBpbmZvLmNhc3RsaW5nLnRvKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmhpZ2hsaWdodFNvdXJjZShpbmZvLmNhc3RsaW5nLnRvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobW92ZS5jYXB0dXJlZCl7XHJcbiAgICAgICAgICAgIGxldCBjYXB0dXJlZFBpZWNlID0gdGhpcy5jaGVzc2JvYXJkLnJlbW92ZVBpZWNlQnlTcXVhcmVLZXkobW92ZS50byk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVySW5mby5hZGRDYXB0dXJlKGNhcHR1cmVkUGllY2UuZmVuQ2hhcilcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vdmUucHJvbW90aW9uKXtcclxuICAgICAgICAgICAgbGV0IHByb21vdGlvbkZlbkNoYXIgPSBtb3ZlLmNvbG9yID09PSBcImJcIiA/IG1vdmUucHJvbW90aW9uIDogbW92ZS5wcm9tb3Rpb24udG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmFkZFBpZWNlKHByb21vdGlvbkZlbkNoYXIsIG1vdmUudG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQucHV0UGllY2VCYWNrV2l0aE5ld1Bvc2l0aW9uKGluZm8ucGllY2UsIGluZm8udG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0VGFyZ2V0KG1vdmUudG8pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1vdmVJbmRleCsrO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRNb3ZlSW5kZXggPCB0aGlzLm1vdmVzLmxlbmd0aCAtMSl7XHJcbiAgICAgICAgICAgIGlmIChqdW1wVG9OZXh0TW92ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVGb3J3YXJkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnN0YXRlID09PSBcInBsYXlcIiB8fCB0aGlzLnN0YXRlID09PSBcImZvcndhcmRcIil7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJwbGF5XCIgfHwgdGhpcy5zdGF0ZSA9PT0gXCJmb3J3YXJkXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVGb3J3YXJkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zdGF0ZSA9PT0gXCJwbGF5XCIgPyB0aGlzLmxvbmdEZWxheUJldHdlZW5Nb3ZlcyA6IHRoaXMuc2hvcnREZWxheUJldHdlZW5Nb3Zlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG1vdmVCYWNrKCl7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uTGF5ZXIuY3VycmVudFRyYW5zaXRpb24pe1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25MYXllci5jYW5jZWxUcmFuc2l0aW9uKFwibW92ZUJhY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY3VycmVudE1vdmVJbmRleCA9PT0gLTEpe1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuY2xlYXJTb3VyY2VBbmRUYXJnZXRIaWdobGlnaHRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcInN0YXJ0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlID0gdGhpcy5tb3Zlc1t0aGlzLmN1cnJlbnRNb3ZlSW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgcGllY2UgPSB0aGlzLmNoZXNzYm9hcmQucmVtb3ZlUGllY2VCeVNxdWFyZUtleShtb3ZlLnRvKTtcclxuICAgICAgICAgICAgaWYgKG1vdmUucHJvbW90aW9uKXtcclxuICAgICAgICAgICAgICAgIGxldCBmZW5DaGFyID0gbW92ZS5jb2xvciA9PT0gXCJiXCIgPyBtb3ZlLnBpZWNlIDogbW92ZS5waWVjZS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgcGllY2UgPSBQaWVjZUZhY3RvcnkuZ2V0KGZlbkNoYXIsIG1vdmUudG8pO1xyXG4gICAgICAgICAgICAgICAgU2hhcmVkLnNldFBvc2l0aW9uKHBpZWNlLmVsZW1lbnQsIG1vdmUudG8sIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobW92ZS5jYXB0dXJlZCl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FwdHVyZUZlbkNoYXIgPSBtb3ZlLmNvbG9yID09PSBcIndcIiA/IG1vdmUuY2FwdHVyZWQgOiBtb3ZlLmNhcHR1cmVkLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllckluZm8ucmVtb3ZlQ2FwdHVyZShjYXB0dXJlRmVuQ2hhcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQucHV0UGllY2VCYWNrV2l0aE5ld1Bvc2l0aW9uKHBpZWNlLCBtb3ZlLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0VGFyZ2V0KG1vdmUudG8pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNhc3RsaW5nID0gdGhpcy5nZXRDYXN0bGluZyhtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChjYXN0bGluZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0U291cmNlKGNhc3RsaW5nLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdHJhbnNpdGlvbkluZm86VHJhbnNpdGlvbi5JbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgY2FuY2VsUmVhc29uOnVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjpcImJhY2tcIiwgXHJcbiAgICAgICAgICAgICAgICBwaWVjZTpwaWVjZSEsXHJcbiAgICAgICAgICAgICAgICBmcm9tOm1vdmUuZnJvbSxcclxuICAgICAgICAgICAgICAgIHRvOm1vdmUudG8sXHJcbiAgICAgICAgICAgICAgICBjYXN0bGluZzogY2FzdGxpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25MYXllci5tb3ZlKHRyYW5zaXRpb25JbmZvLCB0aGlzLnNob3J0VHJhbnNpdGlvbkR1cmF0aW9uLCAoKSA9PntcclxuICAgICAgICAgICAgICAgIC8vT25UcmFuc2l0aW9uRW5kXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaE1vdmVCYWNrKHRyYW5zaXRpb25JbmZvLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sICgpID0+e1xyXG4gICAgICAgICAgICAgICAgLy9PblRyYW5zaXRpb25DYW5jZWxcclxuICAgICAgICAgICAgICAgIC8vIElmIGNhbmNlbGxlZCBieSBjbGljayBiYWNrIHRoZW4gZmluaXNoIG1vdmluZyBiYWNrXHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbkluZm8uY2FuY2VsUmVhc29uID09PSBcIm1vdmVCYWNrXCIgfHwgdHJhbnNpdGlvbkluZm8uY2FuY2VsUmVhc29uID09PSBcInJvdGF0ZVwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaE1vdmVCYWNrKHRyYW5zaXRpb25JbmZvLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIElmIGNhbmNlbGxlZCBieSBjbGljayBmb3J3YXJkIHRoZW4gcmVkbyBjYXB0dXJlIGFuZCBwcm9tb3Rpb25cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBpZWNlID0gdHJhbnNpdGlvbkluZm8ucGllY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmUucHJvbW90aW9uKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZlbkNoYXIgPSBtb3ZlLmNvbG9yID09PSBcImJcIiA/IG1vdmUucHJvbW90aW9uIDogbW92ZS5wcm9tb3Rpb24udG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UgPSBQaWVjZUZhY3RvcnkuZ2V0KGZlbkNoYXIsIG1vdmUudG8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobW92ZS5jYXB0dXJlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYXB0dXJlUGllY2UgPSB0aGlzLmNoZXNzYm9hcmQucmVtb3ZlUGllY2VCeVNxdWFyZUtleShtb3ZlLnRvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJJbmZvLmFkZENhcHR1cmUoY2FwdHVyZVBpZWNlLmZlbkNoYXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQucHV0UGllY2VCYWNrV2l0aE5ld1Bvc2l0aW9uKHBpZWNlLCBtb3ZlLnRvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbkluZm8uY2FzdGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQucHV0UGllY2VCYWNrV2l0aE5ld1Bvc2l0aW9uKHRyYW5zaXRpb25JbmZvLmNhc3RsaW5nLnJvb2ssIHRyYW5zaXRpb25JbmZvLnRvKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwicGxheVwiIHx8IHRoaXMuc3RhdGUgPT09IFwiZm9yd2FyZFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRm9yd2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5pc2hNb3ZlQmFjayhpbmZvOlRyYW5zaXRpb24uSW5mbywganVtcFRvTmV4dE1vdmU6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnB1dFBpZWNlQmFja1dpdGhOZXdQb3NpdGlvbihpbmZvLnBpZWNlLCBpbmZvLmZyb20pO1xyXG4gICAgICAgIHRoaXMuY2hlc3Nib2FyZC5oaWdobGlnaHRTb3VyY2UoaW5mby5mcm9tKTtcclxuICAgICAgICBpZiAoaW5mby5jYXN0bGluZyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5wdXRQaWVjZUJhY2tXaXRoTmV3UG9zaXRpb24oaW5mby5jYXN0bGluZy5yb29rLCBpbmZvLmNhc3RsaW5nLmZyb20pO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0VGFyZ2V0KGluZm8uY2FzdGxpbmcuZnJvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRNb3ZlSW5kZXggPiAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vdmVJbmRleC0tO1xyXG4gICAgICAgICAgICBpZiAoanVtcFRvTmV4dE1vdmUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUgPT09IFwicmV3aW5kXCIpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwicmV3aW5kXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zaG9ydERlbGF5QmV0d2Vlbk1vdmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Q2FzdGxpbmcobW92ZTpNb3ZlLCBpc0ZvcndhcmQ6Ym9vbGVhbil7XHJcbiAgICAgICAgaWYgKG1vdmUuc2FuWzBdID09PSBcIk9cIil7XHJcbiAgICAgICAgICAgIGxldCBmcm9tID0gbW92ZS5jb2xvciA9PT0gXCJ3XCIgPyAobW92ZS5zYW4gPT09IFwiTy1PXCIgPyBcImgxXCIgOiBcImExXCIpIDogKG1vdmUuc2FuID09PSBcIk8tT1wiID8gXCJoOFwiIDogXCJhOFwiKTtcclxuICAgICAgICAgICAgbGV0IHRvID0gbW92ZS5jb2xvciA9PT0gXCJ3XCIgPyAobW92ZS5zYW4gPT09IFwiTy1PXCIgPyBcImYxXCIgOiBcImQxXCIpIDogKG1vdmUuc2FuID09PSBcIk8tT1wiID8gXCJmOFwiOiBcImQ4XCIpO1xyXG4gICAgICAgICAgICBsZXQgcm9vayA9IHRoaXMuY2hlc3Nib2FyZC5yZW1vdmVQaWVjZUJ5U3F1YXJlS2V5KGlzRm9yd2FyZCA/IGZyb20gOiB0bykhO1xyXG4gICAgICAgICAgICByZXR1cm4ge3Jvb2ssIGZyb20sIHRvfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENhcHR1cmVQaWVjZUZhY3RvcnkgfSBmcm9tIFwiLi9DYXB0dXJlUGllY2VGYWN0b3J5XCI7XHJcblxyXG5jb25zdCBwaWVjZVZhbHVlczpSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge1tcInBcIl06MSxbXCJuXCJdOjMsW1wiYlwiXTozLFtcInJcIl06NSxbXCJxXCJdOjksW1wiUFwiXTotMSxbXCJOXCJdOi0zLFtcIkJcIl06LTMsW1wiUlwiXTotNSxbXCJRXCJdOi05fTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckluZm97XHJcbiAgICBwcml2YXRlIGNvbnRhaW5lcjpIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgd2hpdGVQbGF5ZXI6SFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGJsYWNrUGxheWVyOkhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB3aGl0ZUNhcHR1cmVzOlJlY29yZDxzdHJpbmcsIEhUTUxFbGVtZW50PiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBibGFja0NhcHR1cmVzOlJlY29yZDxzdHJpbmcsIEhUTUxFbGVtZW50PiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBzY29yZSA9IDA7XHJcbiAgICBwcml2YXRlIHdoaXRlU2NvcmU6SFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGJsYWNrU2NvcmU6SFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHdoaXRlUGxheWVyTmFtZTpIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgYmxhY2tQbGF5ZXJOYW1lOkhUTUxFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjpIVE1MRWxlbWVudCwgZmVuOnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuYmxhY2tQbGF5ZXIgPSB0aGlzLmFkZENoaWxkKHRoaXMuY29udGFpbmVyLCBcImRpdlwiLCBcInBsYXllciBibGFjayBcIiArIChpc1JvdGF0ZWQgPyBcImJlbG93XCIgOiBcImFib3ZlXCIpKTtcclxuICAgICAgICB0aGlzLndoaXRlUGxheWVyID0gdGhpcy5hZGRDaGlsZCh0aGlzLmNvbnRhaW5lciwgXCJkaXZcIiwgXCJwbGF5ZXIgd2hpdGUgXCIgKyAoaXNSb3RhdGVkID8gXCJhYm92ZVwiIDogXCJiZWxvd1wiKSk7XHJcblxyXG4gICAgICAgIGxldCBwbGF5ZXJBYm92ZUJvYXJkID0gaXNSb3RhdGVkID8gdGhpcy53aGl0ZVBsYXllciA6IHRoaXMuYmxhY2tQbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHBsYXllckFib3ZlQm9hcmQsIHRoaXMuY29udGFpbmVyLmZpcnN0Q2hpbGQhKTtcclxuXHJcbiAgICAgICAgbGV0IGJsYWNrQ2FwdHVyZSA9IHRoaXMuYWRkQ2hpbGQodGhpcy5ibGFja1BsYXllciwgXCJkaXZcIiwgXCJjYXB0dXJlc1wiKTtcclxuICAgICAgICBsZXQgd2hpdGVDYXB0dXJlID0gdGhpcy5hZGRDaGlsZCh0aGlzLndoaXRlUGxheWVyLCBcImRpdlwiLCBcImNhcHR1cmVzXCIpO1xyXG5cclxuICAgICAgICBsZXQgcmVjb3JkID0gW3RoaXMud2hpdGVDYXB0dXJlcywgdGhpcy5ibGFja0NhcHR1cmVzXTtcclxuICAgICAgICBbd2hpdGVDYXB0dXJlLCBibGFja0NhcHR1cmVdLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgW1wicFwiLCBcIm5cIiwgXCJiXCIsIFwiclwiLCBcInFcIl0uZm9yRWFjaCh0eXBlID0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5hZGRDaGlsZChlbGVtZW50LCBcInNwYW5cIiwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICByZWNvcmRbaW5kZXhdW3R5cGVdID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMud2hpdGVTY29yZSA9IHRoaXMuYWRkQ2hpbGQodGhpcy53aGl0ZVBsYXllciwgXCJzcGFuXCIsIFwic2NvcmVcIik7XHJcbiAgICAgICAgdGhpcy5ibGFja1Njb3JlID0gdGhpcy5hZGRDaGlsZCh0aGlzLmJsYWNrUGxheWVyLCBcInNwYW5cIiwgXCJzY29yZVwiKTtcclxuICAgICAgICB0aGlzLndoaXRlUGxheWVyTmFtZSA9IHRoaXMuYWRkQ2hpbGQodGhpcy53aGl0ZVBsYXllciwgXCJkaXZcIiwgXCJuYW1lXCIsIFwiV2hpdGVcIik7XHJcbiAgICAgICAgdGhpcy5ibGFja1BsYXllck5hbWUgPSB0aGlzLmFkZENoaWxkKHRoaXMuYmxhY2tQbGF5ZXIsIFwiZGl2XCIsIFwibmFtZVwiLCBcIkJsYWNrXCIpO1xyXG4gICAgICAgIGlmIChmZW4pe1xyXG4gICAgICAgICAgICB0aGlzLnNldFNjb3JlQW5kQ2FwdXRlcmVCeUZlbihmZW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJvdGF0ZShpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IHBsYXllckFib3ZlQm9hcmQgPSBpc1JvdGF0ZWQgPyB0aGlzLndoaXRlUGxheWVyIDogdGhpcy5ibGFja1BsYXllcjtcclxuICAgICAgICBsZXQgcGxheWVyQmVsb3dCb2FyZCA9IGlzUm90YXRlZCA/IHRoaXMuYmxhY2tQbGF5ZXIgOiB0aGlzLndoaXRlUGxheWVyO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShwbGF5ZXJBYm92ZUJvYXJkLCB0aGlzLmNvbnRhaW5lci5maXJzdENoaWxkISk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyQmVsb3dCb2FyZCk7XHJcbiAgICAgICAgcGxheWVyQWJvdmVCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiYmVsb3dcIik7XHJcbiAgICAgICAgcGxheWVyQmVsb3dCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiYWJvdmVcIik7XHJcbiAgICAgICAgcGxheWVyQWJvdmVCb2FyZC5jbGFzc0xpc3QuYWRkKFwiYWJvdmVcIik7XHJcbiAgICAgICAgcGxheWVyQmVsb3dCb2FyZC5jbGFzc0xpc3QuYWRkKFwiYmVsb3dcIik7XHJcbiAgICB9XHJcbiAgICBzZXRTY29yZShzY29yZTpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuc2NvcmUgPSBzY29yZTtcclxuICAgICAgICBsZXQgd2hpdGVQcmVmaXggPSBzY29yZSA9PT0gMCA/IFwiXCIgOiAoc2NvcmUgPiAwID8gXCIrXCIgOiBcIi1cIik7XHJcbiAgICAgICAgbGV0IGJsYWNrUHJlZml4ID0gc2NvcmUgPT09IDAgPyBcIlwiIDogKHNjb3JlID4gMCA/IFwiLVwiIDogXCIrXCIpO1xyXG4gICAgICAgIHRoaXMud2hpdGVTY29yZS5pbm5lckhUTUwgPSBzY29yZSA9PT0gMCA/IFwiXCIgOiAod2hpdGVQcmVmaXggKyBNYXRoLmFicyhzY29yZSkpO1xyXG4gICAgICAgIHRoaXMuYmxhY2tTY29yZS5pbm5lckhUTUwgPSBzY29yZSA9PT0gMCA/IFwiXCIgOiAoYmxhY2tQcmVmaXggKyBNYXRoLmFicyhzY29yZSkpO1xyXG4gICAgfVxyXG4gICAgc2V0UGxheWVyTmFtZXMoYmxhY2s6c3RyaW5nLCB3aGl0ZTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYmxhY2tQbGF5ZXJOYW1lLmlubmVySFRNTCA9IGJsYWNrO1xyXG4gICAgICAgIHRoaXMud2hpdGVQbGF5ZXJOYW1lLmlubmVySFRNTCA9IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgc2V0U2NvcmVBbmRDYXB1dGVyZUJ5RmVuKGZlbjpzdHJpbmcpeyAgICAgXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLndoaXRlQ2FwdHVyZXMpLmNvbmNhdChPYmplY3QudmFsdWVzKHRoaXMuYmxhY2tDYXB0dXJlcykpLmZvckVhY2goZWxlbWVudCA9PntcclxuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2V0U2NvcmUoMCk7XHJcbiAgICAgICAgaWYgKGZlbiAhPT0gXCJzdGFydFwiICYmIGZlbiAhPT0gXCJcIil7XHJcbiAgICAgICAgICAgIGxldCBzdGFuZGluZyA9IHRoaXMuY2FsY3VsYXRlU2NvcmVBbmRDYXB0dXJlc0J5RmVuKGZlbik7XHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHN0YW5kaW5nLmNhcHR1cmVzKS5mb3JFYWNoKChbZmVuQ2hhciwgY291bnRdKSA9PntcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2FwdHVyZShmZW5DaGFyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZENhcHR1cmUoZmVuQ2hhcjpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBwaWVjZSA9IENhcHR1cmVQaWVjZUZhY3RvcnkuZ2V0KGZlbkNoYXIpO1xyXG4gICAgICAgIGxldCBmZW5DaGFyTG93ZXJDYXNlID0gZmVuQ2hhci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGxldCBpc0JsYWNrID0gZmVuQ2hhciA9PT0gZmVuQ2hhckxvd2VyQ2FzZTtcclxuICAgICAgICBsZXQgc3BhbiA9IGlzQmxhY2sgPyB0aGlzLndoaXRlQ2FwdHVyZXNbZmVuQ2hhckxvd2VyQ2FzZV0gOiB0aGlzLmJsYWNrQ2FwdHVyZXNbZmVuQ2hhckxvd2VyQ2FzZV07XHJcbiAgICAgICAgc3Bhbi5hcHBlbmRDaGlsZChwaWVjZSk7XHJcbiAgICAgICAgbGV0IHBpZWNlVmFsdWUgPSBwaWVjZVZhbHVlc1tmZW5DaGFyXTtcclxuICAgICAgICBsZXQgbmV3U2NvcmUgPSB0aGlzLnNjb3JlICsgcGllY2VWYWx1ZTtcclxuICAgICAgICB0aGlzLnNldFNjb3JlKG5ld1Njb3JlKTtcclxuICAgIH1cclxuICAgIHJlbW92ZUNhcHR1cmUoZmVuQ2hhcjpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBmZW5DaGFyTG93ZXJDYXNlID0gZmVuQ2hhci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGxldCBpc0JsYWNrID0gZmVuQ2hhciA9PT0gZmVuQ2hhckxvd2VyQ2FzZTtcclxuICAgICAgICBsZXQgc3BhbiA9IGlzQmxhY2sgPyB0aGlzLndoaXRlQ2FwdHVyZXNbZmVuQ2hhckxvd2VyQ2FzZV0gOiB0aGlzLmJsYWNrQ2FwdHVyZXNbZmVuQ2hhckxvd2VyQ2FzZV07XHJcbiAgICAgICAgc3Bhbi5yZW1vdmVDaGlsZChzcGFuLmZpcnN0Q2hpbGQhKTtcclxuICAgICAgICBsZXQgcGllY2VWYWx1ZSA9IHBpZWNlVmFsdWVzW2ZlbkNoYXJdO1xyXG4gICAgICAgIGxldCBuZXdTY29yZSA9IHRoaXMuc2NvcmUgLSBwaWVjZVZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U2NvcmUobmV3U2NvcmUpO1xyXG4gICAgfVxyXG4gICAgY2FsY3VsYXRlU2NvcmVBbmRDYXB0dXJlc0J5RmVuKGZlbjpzdHJpbmcpe1xyXG4gICAgICAgIC8vIGV4YW1wbGU6IFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIlxyXG4gICAgICAgIGZlbiA9IGZlbi5zcGxpdChcIiBcIilbMF0uc3BsaXQoXCIvXCIpLmpvaW4oXCJcIik7XHJcbiAgICAgICAgLy8gbWFrZSBhIHJlY29yZCBvZiBhbGwgdHlwZXMgb2YgcGllY2VzIGFuZCBzZXQgaW5pdGlhbCBjb3VudCB0byB6ZXJvXHJcbiAgICAgICAgbGV0IGZlbkNoYXJzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XHJcbiAgICAgICAgW1wicFwiLFwiblwiLFwiYlwiLFwiclwiLFwicVwiLFwiUFwiLFwiTlwiLFwiQlwiLFwiUlwiLFwiUVwiXS5mb3JFYWNoKGNoYXIgPT57XHJcbiAgICAgICAgICAgIGZlbkNoYXJzW2NoYXJdID0gMDtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjYWxjdWxhdGUgaG93IG1hbnkgcGllY2VzIHdlIGhhdmUgb2YgZWFjaCBraW5kXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIGZlbikge1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4ocGFyc2VJbnQoY2hhcikpKXtcclxuICAgICAgICAgICAgICAgIGZlbkNoYXJzW2NoYXJdICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGlmIHRoZSBzY29yZSBpcyBwb3NpdGl2ZSB3aGl0ZSBpcyBsZWFkaW5nXHJcbiAgICAgICAgbGV0IHNjb3JlID0gZmVuQ2hhcnNbXCJQXCJdIC0gZmVuQ2hhcnNbXCJwXCJdO1xyXG4gICAgICAgIHNjb3JlICs9IChmZW5DaGFyc1tcIk5cIl0gKyBmZW5DaGFyc1tcIkJcIl0gLSBmZW5DaGFyc1tcIm5cIl0gLSBmZW5DaGFyc1tcImJcIl0pICogMztcclxuICAgICAgICBzY29yZSArPSAoZmVuQ2hhcnNbXCJSXCJdIC0gZmVuQ2hhcnNbXCJyXCJdKSAqIDU7XHJcbiAgICAgICAgc2NvcmUgKz0gKGZlbkNoYXJzW1wiUVwiXSAtIGZlbkNoYXJzW1wicVwiXSkgKiA5O1xyXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gcmV0dXJuIGEgc2ltaWxhciByZWNvcmQgc2hvd2luZyBob3cgbWFueSBwaWVjZXMgaGF2ZSBiZWVuIHRha2VuXHJcbiAgICAgICAgbGV0IGNhcHR1cmVzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XHJcbiAgICAgICAgLy8gd2Ugc3RhcnRlZCBoYXZpbmcgMiByb29rcywga25pZ2h0cyBhbmQgYmlzaG9wcy4gV2UgY291bGQgaGF2ZSBtb3JlIGR1ZSB0byBwcm9tb3Rpb25cclxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgW1wiclwiLCBcIm5cIiwgXCJiXCIsIFwiUlwiLCBcIk5cIiwgXCJCXCJdKXtcclxuICAgICAgICAgICAgY2FwdHVyZXNbY2hhcl0gPSBmZW5DaGFyc1tjaGFyXSA+PSAyID8gMCA6IDIgLSBmZW5DaGFyc1tjaGFyXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFtcInFcIiwgXCJRXCJdKXtcclxuICAgICAgICAgICAgY2FwdHVyZXNbY2hhcl0gPSBmZW5DaGFyc1tjaGFyXSA+IDAgPyAwIDogMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ291bnRpbmcgdGFrZW4gcGF3bnMgaXMgZGlmZmljdWx0IGR1ZSB0byBwb3NzaWJsZSBwcm9tb3Rpb25cclxuICAgICAgICBsZXQgYmxhY2sgPSB7cGF3bjpcInBcIiwgcXVlZW46IFwicVwiLCBwaWVjZXM6W1wiclwiLCBcIm5cIiwgXCJiXCJdfTtcclxuICAgICAgICBsZXQgd2hpdGUgPSB7cGF3bjpcIlBcIiwgcXVlZW46IFwiUVwiLCBwaWVjZXM6W1wiUlwiLCBcIk5cIiwgXCJCXCJdfTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiBbYmxhY2ssIHdoaXRlXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhcHR1cmVzW3BsYXllci5wYXduXSA9IDggLSBmZW5DaGFyc1twbGF5ZXIucGF3bl07XHJcbiAgICAgICAgICAgIGlmIChmZW5DaGFyc1twbGF5ZXIucXVlZW5dID4gMSl7XHJcbiAgICAgICAgICAgICAgICBjYXB0dXJlc1twbGF5ZXIucGF3bl0gLT0gZmVuQ2hhcnNbcGxheWVyLnF1ZWVuXSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpZWNlIG9mIHBsYXllci5waWVjZXMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGZlbkNoYXJzW3BpZWNlXSA+IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmVzW3BsYXllci5wYXduXSAtPSBmZW5DaGFyc1twaWVjZV0gLTI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtzY29yZSwgY2FwdHVyZXN9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZENoaWxkKHBhcmVudDpIVE1MRWxlbWVudCwgdGFnOnN0cmluZywgY2xhc3NOYW1lOnN0cmluZywgdGV4dD86c3RyaW5nKXtcclxuICAgICAgICBsZXQgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICAgICAgY2hpbGQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgICAgIGlmICh0ZXh0KVxyXG4gICAgICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi4vY2hlc3Nib2FyZC9TaGFyZWRcIjtcclxuaW1wb3J0IFBpZWNlIGZyb20gXCIuLi9jaGVzc2JvYXJkL1BpZWNlXCI7XHJcbmltcG9ydCBUcmFuc2l0aW9uIGZyb20gXCIuL1RyYW5zaXRpb25cIjtcclxuaW1wb3J0IFBpZWNlRmFjdG9yeSBmcm9tIFwiLi4vY2hlc3Nib2FyZC9QaWVjZUZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYW5zaXRpb25MYXllcntcclxuICAgIHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudDtcclxuICAgIGdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgaXNSb3RhdGVkOmJvb2xlYW47XHJcbiAgICBjdXJyZW50VHJhbnNpdGlvbjpUcmFuc2l0aW9uLkluZm98dW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudCwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdCA9IHN2Z1Jvb3Q7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmRDaGlsZChncm91cCk7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGdyb3VwO1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uUGllY2VzOlJlY29yZDxzdHJpbmcsUGllY2U+ID0ge307XHJcbiAgICAgICAgW1wicFwiLFwiclwiLFwia1wiLFwiYlwiLFwicVwiLFwia1wiLFwiUFwiLFwiUlwiLFwiTlwiLFwiQlwiLFwiUVwiLFwiS1wiXS5mb3JFYWNoKGZlbkNoYXIgPT57XHJcbiAgICAgICAgICAgIGxldCBwaWVjZSA9IFBpZWNlRmFjdG9yeS5nZXQoZmVuQ2hhcik7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25QaWVjZXNbZmVuQ2hhcl0gPSBwaWVjZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJvdGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gIXRoaXMuaXNSb3RhdGVkO1xyXG4gICAgfVxyXG4gICAgY2FuY2VsVHJhbnNpdGlvbihyZWFzb246VHJhbnNpdGlvbi5DYW5jZWxSZWFzb24pe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUcmFuc2l0aW9uKXtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VHJhbnNpdGlvbi5jYW5jZWxSZWFzb24gPSByZWFzb247XHJcblxyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuY3VycmVudFRyYW5zaXRpb24ucGllY2UuZWxlbWVudDtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSBcIlwiO1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IFwiXCI7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYXN0bGluZyA9IHRoaXMuY3VycmVudFRyYW5zaXRpb24uY2FzdGxpbmc7XHJcbiAgICAgICAgICAgIGlmIChjYXN0bGluZyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGNhc3RsaW5nLnJvb2suZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1vdmUoaW5mbzpUcmFuc2l0aW9uLkluZm8sIGR1cmF0aW9uOnN0cmluZywgb25UcmFuc2l0aW9uRW5kOkZ1bmN0aW9uLCBvblRyYW5zaXRpb25DYW5jZWw6RnVuY3Rpb24pe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRyYW5zaXRpb24gPSBpbmZvO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoaW5mby5waWVjZS5lbGVtZW50KTtcclxuICAgICAgICBpZiAoaW5mby5jYXN0bGluZyl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoaW5mby5jYXN0bGluZy5yb29rLmVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbmZvLnBpZWNlLmVsZW1lbnQub250cmFuc2l0aW9uZW5kID0gKCkgPT57XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVHJhbnNpdGlvbihpbmZvLnBpZWNlLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoaW5mby5jYXN0bGluZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVRyYW5zaXRpb24oaW5mby5jYXN0bGluZy5yb29rLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRyYW5zaXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIG9uVHJhbnNpdGlvbkVuZCgpO1xyXG4gICAgICAgIH07IFxyXG4gICAgICAgIGluZm8ucGllY2UuZWxlbWVudC5vbnRyYW5zaXRpb25jYW5jZWwgPSAoKSA9PntcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVUcmFuc2l0aW9uKGluZm8ucGllY2UuZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmIChpbmZvLmNhc3RsaW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlVHJhbnNpdGlvbihpbmZvLmNhc3RsaW5nLnJvb2suZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VHJhbnNpdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgb25UcmFuc2l0aW9uQ2FuY2VsKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbihpbmZvLmRpcmVjdGlvbiwgZHVyYXRpb24sIGluZm8ucGllY2UuZWxlbWVudCwgaW5mby5mcm9tLCBpbmZvLnRvKTtcclxuICAgICAgICAgICAgaWYgKGluZm8uY2FzdGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFRyYW5zaXRpb24oaW5mby5kaXJlY3Rpb24sIGR1cmF0aW9uLCBpbmZvLmNhc3RsaW5nLnJvb2suZWxlbWVudCwgaW5mby5jYXN0bGluZy5mcm9tLCBpbmZvLmNhc3RsaW5nLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sMSk7XHJcbiAgICB9XHJcbiAgICBzdGFydFRyYW5zaXRpb24oZGlyZWN0aW9uOlRyYW5zaXRpb24uRGlyZWN0aW9uLCBkdXJhdGlvbjpzdHJpbmcsIGVsZW1lbnQ6U1ZHR0VsZW1lbnQsIGZyb206c3RyaW5nLCB0bzpzdHJpbmcpe1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IFwidHJhbnNmb3JtXCI7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgICAgICBsZXQgZGVzdCA9IGRpcmVjdGlvbiA9PT0gXCJmb3J3YXJkXCIgPyB0byA6IGZyb207XHJcbiAgICAgICAgbGV0IGNvcmRzID0gU2hhcmVkLmdldENvcmRpbmF0ZXNCeVNxdWFyZUtleShkZXN0LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7Y29yZHMueCAqIDEyLjV9JSwgJHtjb3Jkcy55ICogMTIuNX0lKWA7XHJcbiAgICB9XHJcbiAgICByZW1vdmVUcmFuc2l0aW9uKGVsZW1lbnQ6U1ZHR0VsZW1lbnQpe1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gXCJcIjtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IFwiXCI7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcIlwiO1xyXG4gICAgICAgIGVsZW1lbnQub250cmFuc2l0aW9uY2FuY2VsID0gbnVsbDtcclxuICAgICAgICBlbGVtZW50Lm9udHJhbnNpdGlvbmVuZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5ncm91cC5yZW1vdmVDaGlsZChlbGVtZW50KTtcclxuICAgIH1cclxufSIsImltcG9ydCBcIi4vb3BlbmluZ3MuY3NzXCI7XHJcbmltcG9ydCBDaGVzc2JvYXJkIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvQ2hlc3Nib2FyZFwiO1xyXG5pbXBvcnQgR2FtZUJyb3dzZXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvdjIvZ2FtZUJyb3dzZXIvR2FtZUJyb3dzZXJcIjtcclxuaW1wb3J0IENoZXNzZ2FtZSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy92Mi9jaGVzc2dhbWUvQ2hlc3NnYW1lXCI7XHJcbmltcG9ydCB7IENoZXNzLCBNb3ZlIH0gZnJvbSBcImNoZXNzLmpzXCI7XHJcbmltcG9ydCAqIGFzIGpzb24gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvY2hlc3MvYXNzZXRzL2RhdGEvZ2FtZXMuanNvblwiO1xyXG5cclxuLy8gbGV0IGJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVzc2JvYXJkXCIpIGFzIEhUTUxFbGVtZW50O1xyXG4vLyBsZXQgY2hlc3Nib2FyZCA9IG5ldyBDaGVzc2JvYXJkKGJvYXJkQ29udGFpbmVyLCBcInN0YXJ0XCIsIGZhbHNlKTtcclxuXHJcbi8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVzdFwiKSEub25jbGljayA9ICgpID0+IGNoZXNzYm9hcmQudGVzdCgpO1xyXG4vLyBsZXQgZiA9XCJyNy8zcXAxazEvMXAxcDFwUDEvcDFuUDFQMi9QblA1LzRCMy80QjMvMVEzSzIgdyAtIC0gMSAyOFwiO1xyXG5sZXQgZmVuID0gXCI4L2twUEs0LzgvOC84LzgvOC84XCI7XHJcbmxldCBicm93c2VyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lQnJvd3NlclwiKSBhcyBIVE1MRWxlbWVudDtcclxubGV0IGdhbWVCcm93c2VyID0gbmV3IEdhbWVCcm93c2VyKGJyb3dzZXJDb250YWluZXIsIGZlbiwgZmFsc2UpO1xyXG5sZXQgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcclxuLy8gY2hlc3MubG9hZFBnbihqc29uLmdhbWVzWzBdLm1vdmVUZXh0KTtcclxuY2hlc3MubG9hZFBnbihcIjEuIGU0IGY1IDIuIGV4ZjUgZzYgMy4gZnhnNiBkNSA0LiBneGg3IE5jNiBoeGc4PVFcIik7XHJcbmxldCBtb3ZlcyA9IGNoZXNzLmhpc3Rvcnkoe3ZlcmJvc2U6dHJ1ZX0pO1xyXG5nYW1lQnJvd3Nlci5sb2FkR2FtZSh7d2hpdGVQbGF5ZXI6XCJXaGl0ZSBwbGF5ZXJcIiwgYmxhY2tQbGF5ZXI6XCJCbGFjayBwbGF5ZXJcIiwgbW92ZXN9KTtcclxuXHJcbi8vIGdhbWVCcm93c2VyLmdvVG9Nb3ZlKDI0KTtcclxuXHJcbi8vIGxldCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVzc2dhbWVcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbi8vIGxldCBjaGVzc2dhbWUgPSBuZXcgQ2hlc3NnYW1lKGdhbWVDb250YWluZXIsIFwic3RhcnRcIiwgZmFsc2UpO1xyXG5cclxubGV0IHN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuc3RhcnQub25jbGljayA9ICgpID0+IHtnYW1lQnJvd3Nlci5nb1RvTW92ZSgtMSl9O1xyXG5cclxubGV0IHJld2luZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV3aW5kXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5yZXdpbmQub25jbGljayA9ICgpID0+IHtnYW1lQnJvd3Nlci5yZXdpbmQoKX07XHJcblxyXG5sZXQgcHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbnByZXZpb3VzLm9uY2xpY2sgPSAoKSA9PiB7Z2FtZUJyb3dzZXIucHJldmlvdXMoKX07XHJcblxyXG5sZXQgcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxucGxheS5vbmNsaWNrID0gKCkgPT4ge2dhbWVCcm93c2VyLnBsYXkoKX07XHJcblxyXG5sZXQgcGF1c2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdXNlXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5wYXVzZS5vbmNsaWNrID0gKCkgPT4ge2dhbWVCcm93c2VyLnBhdXNlKCl9O1xyXG5cclxubGV0IG5leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHRcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbm5leHQub25jbGljayA9ICgpID0+IHtnYW1lQnJvd3Nlci5uZXh0KCl9O1xyXG5cclxubGV0IGZvcndhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcndhcmRcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmZvcndhcmQub25jbGljayA9ICgpID0+IHtnYW1lQnJvd3Nlci5mb3J3YXJkKCl9O1xyXG5cclxubGV0IGVuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5kXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5lbmQub25jbGljayA9ICgpID0+IHtnYW1lQnJvd3Nlci5nb1RvTW92ZShtb3Zlcy5sZW5ndGggLTEpfTtcclxuXHJcbmxldCByb3RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdGF0ZVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxucm90YXRlLm9uY2xpY2sgPSAoKSA9PiB7Z2FtZUJyb3dzZXIucm90YXRlKCl9O1xyXG5cclxuLy8gZ29Ub01vdmUub25jbGljayA9ICgpID0+IHtnYW1lQnJvd3Nlci5nb1RvTW92ZSgyNCl9O1xyXG5cclxuXHJcbi8vIGxldCBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15LWltZ1wiKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4vLyBpbWcuc3JjID0gYm9hcmQyO1xyXG4vLyBsZXQgc3ZnID0gY3JlYXRlQmFja2dyb3VuZCgpO1xyXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZChzdmcpO1xyXG4vLyBkZWJ1Z2dlcjtcclxuXHJcbi8vIHNldFRhcmdldEFuZFNvdXJjZShcImUyXCIsIFwiZTRcIiwgc3ZnKTtcclxuXHJcbi8vIGxldCBib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmRcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbi8vIGxldCBzdmcgPSBib2FyZC5maXJzdENoaWxkIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbi8vIHN2Zy5zcmMgPSBib2FyZGJnO1xyXG4vLyBmb3IgKGxldCBlbGVtZW50IG9mIGJvYXJkLmNoaWxkcmVuKXtcclxuLy8gICAgIGlmICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJiYWNrZ3JvdW5kXCIpKXtcclxuLy8gICAgICAgICBsZXQgaW1hZ2UgPSBlbGVtZW50Lmxhc3RDaGlsZCBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4vLyAgICAgICAgIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3cFwiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiUFwiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid3JcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIlJcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcInduXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJOXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3YlwiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiQlwiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid3FcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIlFcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcIndrXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJLXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuICAgIFxyXG4vLyB9XHJcbi8vIGxldCBxdWVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lTlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcIipcIilbNjhdO1xyXG4vLyBsZXQgYmJveCA9IGtpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbi8vIGNvbnNvbGUubG9nKGJib3gpO1xyXG5cclxuLy8gbGV0IHN2Z1RhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN2Z1wiKSBhcyBIVE1MQ29sbGVjdGlvbk9mPFNWR0VsZW1lbnQ+O1xyXG4vLyBsZXQgcXVlZW4gPSBzdmdUYWdzWzFdIGFzIFNWR0VsZW1lbnQ7XHJcbi8vIGdldEJvdW5kaW5nQm94T2ZTdmdQYXRoKHF1ZWVuKTtcclxuXHJcbi8vIGltcG9ydCBcIi4uL21hc3Rlci5jc3NcIjtcclxuLy8gaW1wb3J0IHsgQ2hlc3Nib2FyZCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2NoZXNzL0NoZXNzYm9hcmRcIjtcclxuXHJcbi8vIGxldCBjaGVzc2JvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVzc2JvYXJkXCIpIGFzIEhUTUxFbGVtZW50O1xyXG4vLyBsZXQgY2hlc3Nib2FyZCA9IG5ldyBDaGVzc2JvYXJkKGNoZXNzYm9hcmRDb250YWluZXIsIFwic3RhcnRcIiwgZmFsc2UpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==