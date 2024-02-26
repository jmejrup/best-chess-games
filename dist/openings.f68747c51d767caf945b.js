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

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/v2/gameNavigator/gameNavigator.css":
/*!*************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/v2/gameNavigator/gameNavigator.css ***!
  \*************************************************************************************************/
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
}`, "",{"version":3,"sources":["webpack://./src/components/v2/gameNavigator/gameNavigator.css"],"names":[],"mappings":"AAAA;IACI,cAAc;IACd,UAAU;AACd;AACA;IACI,eAAe;IACf,mBAAmB;AACvB;AACA;IACI,eAAe;AACnB;AACA;IACI,eAAe;AACnB;AACA;IACI,UAAU;IACV,iBAAiB;IACjB,iBAAiB;IACjB,eAAe;AACnB;AACA;IACI,UAAU;IACV,eAAe;AACnB;AACA;IACI,UAAU;IACV,eAAe;IACf,cAAc;IACd,cAAc;AAClB;AACA;IACI,eAAe;IACf,UAAU;IACV,SAAS;IACT,cAAc;IACd,YAAY;IACZ,mBAAmB;AACvB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,gBAAgB;AACpB;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,mBAAmB;IACnB,iBAAiB;IACjB,iBAAiB;AACrB","sourcesContent":[".player{\r\n    column-count:2;\r\n    height:4vh;\r\n}\r\n.player.above{\r\n    padding-top:4px;\r\n    margin-bottom: -3px;\r\n}\r\n.player.below{\r\n    margin-top:-1px;\r\n}\r\n.player.below .captures{\r\n    margin-top:-6px;\r\n}\r\n.player .name{\r\n    clear:both;\r\n    text-align: right;\r\n    padding-right:4px;\r\n    line-height:3vh;\r\n}\r\n.player .captures{\r\n    float:left;\r\n    margin-top:-5px;\r\n}\r\n.player .score{\r\n    float:left;\r\n    margin-left:5px;\r\n    margin-top:2px;\r\n    font-size:10pt;\r\n}\r\n.player .captures svg{\r\n    position:static;\r\n    height:4vh;\r\n    width:4vh;\r\n    transform:none;\r\n    margin-top:0;\r\n    margin-bottom:-11px;\r\n}\r\n.player.white .captures span{\r\n    padding-bottom: 7px;\r\n}\r\n.player .captures .p svg:first-child{\r\n    padding-left:4px;\r\n}\r\n.player .captures .p svg{\r\n    margin-left:-8px;\r\n    margin-right:-5px;\r\n}\r\n.player .captures .n{\r\n    margin-left: 2px;\r\n    margin-right: 1px;\r\n}\r\n.player .captures .n svg{\r\n    margin-left: -6px;\r\n    margin-right: -3px;\r\n}\r\n.player .captures .b svg{\r\n    margin-left: -7px;\r\n    margin-right: -4px;\r\n}\r\n.player .captures .r svg{\r\n    margin-left: -6px;\r\n    margin-right: -5px;\r\n}\r\n.player .captures .q svg{\r\n    margin-bottom:-10px;\r\n    margin-left: -2px;\r\n    margin-right: 0px;\r\n}"],"sourceRoot":""}]);
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

/***/ "./src/components/v2/gameNavigator/gameNavigator.css":
/*!***********************************************************!*\
  !*** ./src/components/v2/gameNavigator/gameNavigator.css ***!
  \***********************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_gameNavigator_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./gameNavigator.css */ "./node_modules/css-loader/dist/cjs.js!./src/components/v2/gameNavigator/gameNavigator.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_gameNavigator_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_gameNavigator_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_gameNavigator_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_gameNavigator_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
    setPiecePosition(piece, squareKey) {
        piece.squareKey = squareKey;
        this.pieceLayer.setPosition(piece);
    }
    addPiece(fenChar, squareKey) {
        return this.pieceLayer.addPiece(fenChar, squareKey);
    }
    // undoPieceRemoval(piece:Piece){
    //     this.pieceLayer.undoPieceRemoval(piece);
    // }
    // putPieceBackWithNewPosition(piece:Piece, squareKey:string){
    //     piece.squareKey = squareKey;
    //     this.pieceLayer.undoPieceRemoval(piece);
    // }
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
    putOnTop(piece) {
        this.pieceLayer.putOnTop(piece);
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
    putOnTop(piece) {
        this.group.appendChild(piece.element);
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

/***/ "./src/components/v2/gameNavigator/CapturePieceFactory.ts":
/*!****************************************************************!*\
  !*** ./src/components/v2/gameNavigator/CapturePieceFactory.ts ***!
  \****************************************************************/
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

/***/ "./src/components/v2/gameNavigator/GameNavigator.ts":
/*!**********************************************************!*\
  !*** ./src/components/v2/gameNavigator/GameNavigator.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Chessboard_1 = __importDefault(__webpack_require__(/*! ../chessboard/Chessboard */ "./src/components/v2/chessboard/Chessboard.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ../chessboard/Shared */ "./src/components/v2/chessboard/Shared.ts"));
const PlayerInfo_1 = __importDefault(__webpack_require__(/*! ./PlayerInfo */ "./src/components/v2/gameNavigator/PlayerInfo.ts"));
const Transitions_1 = __webpack_require__(/*! ./Transitions */ "./src/components/v2/gameNavigator/Transitions.ts");
const PieceFactory_1 = __importDefault(__webpack_require__(/*! ../chessboard/PieceFactory */ "./src/components/v2/chessboard/PieceFactory.ts"));
__webpack_require__(/*! ./gameNavigator.css */ "./src/components/v2/gameNavigator/gameNavigator.css");
class GameBrowser {
    constructor(container, fen, isRotated) {
        this.state = "start";
        this.moves = [];
        this.moveIndex = 0;
        this.shortDelayBetweenMoves = 200;
        this.longDelayBetweenMoves = 1000;
        this.shortTransitionDuration = "500ms";
        this.longTransitionDuration = "2000ms";
        this.chessboard = new Chessboard_1.default(container, fen, isRotated);
        this.playerInfo = new PlayerInfo_1.default(container, fen, isRotated);
        this.transitions = new Transitions_1.Transitions(this.chessboard, isRotated);
        this.isRotated = isRotated;
    }
    rotate() {
        this.isRotated = !this.isRotated;
        this.chessboard.rotate();
        this.playerInfo.rotate(this.isRotated);
        this.transitions.rotate();
    }
    loadGame(game) {
        this.chessboard.setFen(Shared_1.default.startFEN, true);
        this.playerInfo.setPlayerNames(game.blackPlayer, game.whitePlayer);
        this.playerInfo.setScoreAndCaputereByFen(Shared_1.default.startFEN);
        this.moves = game.moves;
        this.moveIndex = -1;
        this.state = "start";
    }
    rewind() {
        this.state = "rewind";
        this.move(false);
    }
    previous() {
        if (this.state === "forward") {
            this.state = "pause";
        }
        this.move(false);
    }
    play() {
        this.state = "play";
        this.move(true);
    }
    pause() {
        this.state = "pause";
    }
    next() {
        if (this.state === "rewind") {
            this.state = "pause";
        }
        this.move(true);
    }
    forward() {
        this.state = "forward";
        this.move(true);
    }
    goToMove(index) {
        clearTimeout(this.timeoutId);
        if (this.transitions.current) {
            this.transitions.cancel();
        }
        this.moveIndex = index;
        if (index === -1) {
            this.state = "start";
            let move = this.moves[0];
            this.chessboard.setFen(move.before, true);
            this.playerInfo.setScoreAndCaputereByFen(move.before);
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
            let castling = this.getCastling(move, true);
            if (castling) {
                this.chessboard.highlightSource(castling.to);
            }
        }
    }
    async move(isForward) {
        clearTimeout(this.timeoutId);
        if (this.transitions.current) {
            let transition = this.transitions.current;
            let piece = transition.piece;
            let move = transition.move;
            let castling = transition.castling;
            this.transitions.cancel();
            if (isForward === transition.isForward) { // If direction has not changed
                this.finishMove(isForward, piece, move, castling);
            }
            else if (isForward) { //Moving back was cancelled so recapture and repromote if necessary
                if (move.captured) { //recapture
                    this.chessboard.removePieceBySquareKey(move.to);
                    this.playerInfo.addCapture(move);
                    this.chessboard.setPiecePosition(piece, move.to);
                }
                if (move.promotion) {
                    let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                    this.chessboard.removePieceBySquareKey(move.to);
                    this.chessboard.addPiece(promotionFenChar, move.to);
                }
            }
            else { //Moving forward was cancelled so undo moveIndex++
                this.moveIndex--;
            }
        }
        if (isForward && this.moveIndex === this.moves.length - 1) {
            this.state = "end";
            return;
        }
        else if (!isForward && this.moveIndex === -1) {
            this.chessboard.clearSourceAndTargetHighlights();
            this.state = "start";
            return;
        }
        if (isForward) {
            this.moveIndex++;
        }
        let move = this.moves[this.moveIndex];
        let piece = this.chessboard.getPiece(isForward ? move.from : move.to);
        let castling = this.getCastling(move, isForward);
        if (isForward) {
            this.chessboard.highlightSource(move.from);
            if (castling) {
                this.chessboard.highlightTarget(castling.from);
            }
        }
        else {
            this.chessboard.highlightTarget(move.to);
            if (castling) {
                this.chessboard.highlightSource(castling.to);
            }
            if (move.promotion) {
                this.chessboard.removePieceBySquareKey(move.to);
                let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                piece = PieceFactory_1.default.get(fenChar);
                Shared_1.default.setPosition(piece.element, move.to, this.isRotated);
            }
            if (move.captured) {
                try {
                    this.playerInfo.undoCapture(move);
                }
                catch (ex) {
                    debugger;
                }
                let capturedFenChar = move.color === "b" ? move.captured.toUpperCase() : move.captured;
                this.chessboard.addPiece(capturedFenChar, move.to);
            }
        }
        let transitionInfo = { isForward, piece, move, castling };
        let duration = this.state === "play" ? this.longTransitionDuration : this.shortTransitionDuration;
        await this.transitions.move(transitionInfo, duration, () => {
            //OnTransitionEnd
            this.finishMove(isForward, piece, move, castling);
        });
    }
    finishMove(isForward, piece, move, castling) {
        if (castling) {
            this.chessboard.setPiecePosition(castling.rook, isForward ? castling.to : castling.from);
            this.chessboard.setPiecePosition(piece, isForward ? move.to : move.from);
            this.chessboard.highlightSource(isForward ? castling.to : castling.from);
            this.chessboard.highlightTarget(isForward ? move.to : move.from);
        }
        else if (isForward) {
            if (move.captured) {
                this.chessboard.removePieceBySquareKey(move.to);
                this.playerInfo.addCapture(move);
            }
            if (move.promotion) {
                let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                this.chessboard.removePieceBySquareKey(move.from);
                this.chessboard.addPiece(promotionFenChar, move.to);
            }
            else {
                this.chessboard.setPiecePosition(piece, move.to);
                this.chessboard.highlightTarget(move.to);
            }
        }
        else {
            this.chessboard.setPiecePosition(piece, move.from);
            this.chessboard.highlightSource(move.from);
        }
        if (!isForward) {
            this.moveIndex--;
        }
        if (this.state === "play" || this.state === "forward" || this.state === "rewind") {
            this.timeoutId = setTimeout(() => {
                if (this.state === "play" || this.state === "forward" || this.state === "rewind") {
                    this.move(isForward);
                }
            }, this.state === "play" ? this.longDelayBetweenMoves : this.shortDelayBetweenMoves);
        }
    }
    getCastling(move, isForward) {
        if (move.san[0] === "O") {
            let from = move.color === "w" ? (move.san === "O-O" ? "h1" : "a1") : (move.san === "O-O" ? "h8" : "a8");
            let to = move.color === "w" ? (move.san === "O-O" ? "f1" : "d1") : (move.san === "O-O" ? "f8" : "d8");
            let rook = this.chessboard.getPiece(isForward ? from : to);
            return { rook, from, to };
        }
        return undefined;
    }
}
exports["default"] = GameBrowser;


/***/ }),

/***/ "./src/components/v2/gameNavigator/PlayerInfo.ts":
/*!*******************************************************!*\
  !*** ./src/components/v2/gameNavigator/PlayerInfo.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const CapturePieceFactory_1 = __webpack_require__(/*! ./CapturePieceFactory */ "./src/components/v2/gameNavigator/CapturePieceFactory.ts");
const pieceValues = { ["p"]: 1, ["n"]: 3, ["b"]: 3, ["r"]: 5, ["q"]: 9, ["k"]: 0, ["P"]: -1, ["N"]: -3, ["B"]: -3, ["R"]: -5, ["Q"]: -9, ["K"]: 0 };
class PlayerInfo {
    constructor(container, fen, isRotated) {
        this.whiteCaptures = {};
        this.blackCaptures = {};
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
    addCapture(move) {
        let fenChar = this.getComputedCapture(move);
        this.addComputedCapture(fenChar);
        this.setScoreByFen(move.after);
    }
    undoCapture(move) {
        let fenChar = this.getComputedCapture(move);
        let fenCharLowerCase = fenChar.toLowerCase();
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.removeChild(span.firstChild);
        this.setScoreByFen(move.before);
    }
    setPlayerNames(black, white) {
        this.blackPlayerName.innerHTML = black;
        this.whitePlayerName.innerHTML = white;
    }
    setScoreAndCaputereByFen(fen) {
        Object.values(this.whiteCaptures).concat(Object.values(this.blackCaptures)).forEach(element => {
            element.innerHTML = "";
        });
        if (fen === "start" || fen === "") {
            this.setScore(0);
        }
        else {
            let captures = this.getCapturesByFen(fen);
            Object.entries(captures).forEach(([fenChar, count]) => {
                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        this.addComputedCapture(fenChar);
                    }
                }
            });
            this.setScoreByFen(fen);
        }
    }
    addComputedCapture(fenChar) {
        let fenCharLowerCase = fenChar.toLowerCase();
        let piece = CapturePieceFactory_1.CapturePieceFactory.get(fenChar);
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.appendChild(piece);
    }
    setScoreByFen(fen) {
        fen = fen.split(" ")[0].split("/").join("");
        let score = 0;
        for (const char of fen) {
            if (isNaN(parseInt(char))) {
                score -= pieceValues[char];
            }
        }
        this.setScore(score);
    }
    setScore(score) {
        let whitePrefix = score === 0 ? "" : (score > 0 ? "+" : "-");
        let blackPrefix = score === 0 ? "" : (score > 0 ? "-" : "+");
        this.whiteScore.innerHTML = score === 0 ? "" : (whitePrefix + Math.abs(score));
        this.blackScore.innerHTML = score === 0 ? "" : (blackPrefix + Math.abs(score));
    }
    // A promoted pawn will only show as a pawn in the capture panel
    getComputedCapture(move) {
        let capture = move.captured;
        let fenChar = move.color === "b" ? capture.toUpperCase() : capture;
        if (capture !== "p") {
            let count = 0;
            for (const char of move.after) {
                if (isNaN(parseInt(char))) {
                    if (char === fenChar) {
                        count++;
                    }
                }
            }
            if (count >= 2 || (capture === "q" && count >= 1)) {
                fenChar = move.color === "b" ? "P" : "p";
            }
        }
        return fenChar;
    }
    getCapturesByFen(fen) {
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
        // we need to return a similar record showing how many pieces have been taken
        let captures = {};
        // we started having 2 rooks, knights and bishops. We could have more due to promotion
        for (const char of ["r", "n", "b", "R", "N", "B"]) {
            captures[char] = fenChars[char] >= 2 ? 0 : 2 - fenChars[char];
        }
        for (const char of ["q", "Q"]) {
            captures[char] = fenChars[char] > 0 ? 0 : 1;
        }
        // Counting captures is difficult due to possible promotion
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
        return captures;
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

/***/ "./src/components/v2/gameNavigator/Transitions.ts":
/*!********************************************************!*\
  !*** ./src/components/v2/gameNavigator/Transitions.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transitions = void 0;
const Shared_1 = __importDefault(__webpack_require__(/*! ../chessboard/Shared */ "./src/components/v2/chessboard/Shared.ts"));
class Transitions {
    constructor(chessboard, isRotated) {
        this.chessboard = chessboard;
        this.isRotated = isRotated;
    }
    rotate() {
        this.isRotated = !this.isRotated;
    }
    cancel() {
        if (this.current) {
            let element = this.current.piece.element;
            this.removeTransition(element);
            let castling = this.current.castling;
            if (castling) {
                this.removeTransition(castling.rook.element);
            }
            this.current = undefined;
        }
    }
    async move(transition, duration, onTransitionEnd) {
        this.chessboard.putOnTop(transition.piece);
        if (transition.castling) {
            this.chessboard.putOnTop(transition.castling.rook);
        }
        this.triggerReflow();
        this.current = transition;
        transition.piece.element.ontransitionend = () => {
            this.removeTransition(transition.piece.element);
            if (transition.castling) {
                this.removeTransition(transition.castling.rook.element);
            }
            this.current = undefined;
            onTransitionEnd();
        };
        this.startTransition(transition.isForward, duration, transition.piece.element, transition.move.from, transition.move.to);
        if (transition.castling) {
            this.startTransition(transition.isForward, duration, transition.castling.rook.element, transition.castling.from, transition.castling.to);
        }
    }
    triggerReflow() {
        void (document.documentElement.offsetHeight);
    }
    startTransition(isForward, duration, element, from, to) {
        element.style.transform = "";
        element.style.transitionProperty = "transform";
        element.style.transitionDuration = duration;
        let dest = isForward ? to : from;
        let cords = Shared_1.default.getCordinatesBySquareKey(dest, this.isRotated);
        element.style.transform = `translate(${cords.x * 12.5}%, ${cords.y * 12.5}%)`;
    }
    removeTransition(element) {
        element.style.transitionProperty = "";
        element.style.transitionDuration = "";
        element.style.transform = "";
        element.ontransitioncancel = null;
        element.ontransitionend = null;
    }
}
exports.Transitions = Transitions;


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
const GameNavigator_1 = __importDefault(__webpack_require__(/*! ../../components/v2/gameNavigator/GameNavigator */ "./src/components/v2/gameNavigator/GameNavigator.ts"));
const chess_js_1 = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/dist/esm/chess.js");
// let boardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(boardContainer, "start", false);
// let f ="r7/3qp1k1/1p1p1pP1/p1nP1P2/PnP5/4B3/4B3/1Q3K2 w - - 1 28";
// let fen = "8/kpPK4/8/8/8/8/8/8";
let gameNavigatorContainer = document.getElementById("gameBrowser");
let gameNavigator = new GameNavigator_1.default(gameNavigatorContainer, "", false);
let chess = new chess_js_1.Chess();
// chess.loadPgn(json.games[0].moveText);
chess.loadPgn("1. e4 f5 2. exf5 g6 3. fxg6 d5 4. gxh7 Nc6 5. hxg8=Q Rg8 6. Bd3 Be6 7. Nf3 Qd6 8. O-O O-O-O");
let moves = chess.history({ verbose: true });
gameNavigator.loadGame({ whitePlayer: "White player", blackPlayer: "Black player", moves });
let start = document.getElementById("start");
start.onclick = () => { gameNavigator.goToMove(-1); };
let rewind = document.getElementById("rewind");
rewind.onclick = () => { gameNavigator.rewind(); };
let previous = document.getElementById("prev");
previous.onclick = () => { gameNavigator.previous(); };
let play = document.getElementById("play");
play.onclick = () => { gameNavigator.play(); };
let pause = document.getElementById("pause");
pause.onclick = () => { gameNavigator.pause(); };
let next = document.getElementById("next");
next.onclick = () => { gameNavigator.next(); };
let forward = document.getElementById("forward");
forward.onclick = () => { gameNavigator.forward(); };
let end = document.getElementById("end");
end.onclick = () => { gameNavigator.goToMove(moves.length - 1); };
let rotate = document.getElementById("rotate");
rotate.onclick = () => { gameNavigator.rotate(); };


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlbmluZ3MuZjY4NzQ3YzUxZDc2N2NhZjk0NWIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywrQkFBK0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsYUFBYTtBQUN2Qix3QkFBd0IsYUFBYTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixjQUFjO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsK0JBQStCO0FBQ2pFO0FBQ0EsNENBQTRDLFNBQVM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsU0FBUztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGNBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LENBQUMsTUFBTSxDQUFzQixDQUFDO0FBQ2hFLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxHQUFDLENBQUM7QUFFNUMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQXNCLENBQUM7QUFDbEUsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRSxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUMsQ0FBQztBQUU5QyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBc0IsQ0FBQztBQUNoRSxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBQyxDQUFDO0FBRTVDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFzQixDQUFDO0FBQ3RFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUUsYUFBYSxDQUFDLE9BQU8sRUFBRSxHQUFDLENBQUM7QUFFbEQsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQXNCLENBQUM7QUFDOUQsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRSxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQztBQUU5RCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztBQUNwRSxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9jaGVzcy5qcy9kaXN0L2VzbS9jaGVzcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvZ2FtZU5hdmlnYXRvci9nYW1lTmF2aWdhdG9yLmNzcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL3BhZ2VzL29wZW5pbmdzL29wZW5pbmdzLmNzcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVOYXZpZ2F0b3IvZ2FtZU5hdmlnYXRvci5jc3M/ZDE2OSIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL3BhZ2VzL29wZW5pbmdzL29wZW5pbmdzLmNzcz9hODJlIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvQ2hlc3Nib2FyZC50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvQXJyb3dMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvQm9hcmRMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvQ29yZHNMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvUGllY2VMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9Nb3VzZUV2ZW50cy50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9QaWVjZUVsZW1lbnRGYWN0b3J5LnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9jaGVzc2JvYXJkL1BpZWNlRmFjdG9yeS50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9TaGFyZWQudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvU3F1YXJlRmFjdG9yeS50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvZ2FtZU5hdmlnYXRvci9DYXB0dXJlUGllY2VGYWN0b3J5LnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9nYW1lTmF2aWdhdG9yL0dhbWVOYXZpZ2F0b3IudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVOYXZpZ2F0b3IvUGxheWVySW5mby50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvZ2FtZU5hdmlnYXRvci9UcmFuc2l0aW9ucy50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL3BhZ2VzL29wZW5pbmdzL09wZW5pbmdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAyMywgSmVmZiBIbHl3YSAoamhseXdhQGdtYWlsLmNvbSlcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAqIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4gKiBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXG4gKiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1NcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxuICogQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEVcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG5leHBvcnQgY29uc3QgV0hJVEUgPSAndyc7XG5leHBvcnQgY29uc3QgQkxBQ0sgPSAnYic7XG5leHBvcnQgY29uc3QgUEFXTiA9ICdwJztcbmV4cG9ydCBjb25zdCBLTklHSFQgPSAnbic7XG5leHBvcnQgY29uc3QgQklTSE9QID0gJ2InO1xuZXhwb3J0IGNvbnN0IFJPT0sgPSAncic7XG5leHBvcnQgY29uc3QgUVVFRU4gPSAncSc7XG5leHBvcnQgY29uc3QgS0lORyA9ICdrJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX1BPU0lUSU9OID0gJ3JuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAxJztcbmNvbnN0IEVNUFRZID0gLTE7XG5jb25zdCBGTEFHUyA9IHtcbiAgICBOT1JNQUw6ICduJyxcbiAgICBDQVBUVVJFOiAnYycsXG4gICAgQklHX1BBV046ICdiJyxcbiAgICBFUF9DQVBUVVJFOiAnZScsXG4gICAgUFJPTU9USU9OOiAncCcsXG4gICAgS1NJREVfQ0FTVExFOiAnaycsXG4gICAgUVNJREVfQ0FTVExFOiAncScsXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG5leHBvcnQgY29uc3QgU1FVQVJFUyA9IFtcbiAgICAnYTgnLCAnYjgnLCAnYzgnLCAnZDgnLCAnZTgnLCAnZjgnLCAnZzgnLCAnaDgnLFxuICAgICdhNycsICdiNycsICdjNycsICdkNycsICdlNycsICdmNycsICdnNycsICdoNycsXG4gICAgJ2E2JywgJ2I2JywgJ2M2JywgJ2Q2JywgJ2U2JywgJ2Y2JywgJ2c2JywgJ2g2JyxcbiAgICAnYTUnLCAnYjUnLCAnYzUnLCAnZDUnLCAnZTUnLCAnZjUnLCAnZzUnLCAnaDUnLFxuICAgICdhNCcsICdiNCcsICdjNCcsICdkNCcsICdlNCcsICdmNCcsICdnNCcsICdoNCcsXG4gICAgJ2EzJywgJ2IzJywgJ2MzJywgJ2QzJywgJ2UzJywgJ2YzJywgJ2czJywgJ2gzJyxcbiAgICAnYTInLCAnYjInLCAnYzInLCAnZDInLCAnZTInLCAnZjInLCAnZzInLCAnaDInLFxuICAgICdhMScsICdiMScsICdjMScsICdkMScsICdlMScsICdmMScsICdnMScsICdoMSdcbl07XG5jb25zdCBCSVRTID0ge1xuICAgIE5PUk1BTDogMSxcbiAgICBDQVBUVVJFOiAyLFxuICAgIEJJR19QQVdOOiA0LFxuICAgIEVQX0NBUFRVUkU6IDgsXG4gICAgUFJPTU9USU9OOiAxNixcbiAgICBLU0lERV9DQVNUTEU6IDMyLFxuICAgIFFTSURFX0NBU1RMRTogNjQsXG59O1xuLypcbiAqIE5PVEVTIEFCT1VUIDB4ODggTU9WRSBHRU5FUkFUSU9OIEFMR09SSVRITVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRnJvbSBodHRwczovL2dpdGh1Yi5jb20vamhseXdhL2NoZXNzLmpzL2lzc3Vlcy8yMzBcbiAqXG4gKiBBIGxvdCBvZiBwZW9wbGUgYXJlIGNvbmZ1c2VkIHdoZW4gdGhleSBmaXJzdCBzZWUgdGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uXG4gKiBvZiBjaGVzcy5qcy4gSXQgdXNlcyB0aGUgMHg4OCBNb3ZlIEdlbmVyYXRpb24gQWxnb3JpdGhtIHdoaWNoIGludGVybmFsbHlcbiAqIHN0b3JlcyB0aGUgYm9hcmQgYXMgYW4gOHgxNiBhcnJheS4gVGhpcyBpcyBwdXJlbHkgZm9yIGVmZmljaWVuY3kgYnV0IGhhcyBhXG4gKiBjb3VwbGUgb2YgaW50ZXJlc3RpbmcgYmVuZWZpdHM6XG4gKlxuICogMS4gMHg4OCBvZmZlcnMgYSB2ZXJ5IGluZXhwZW5zaXZlIFwib2ZmIHRoZSBib2FyZFwiIGNoZWNrLiBCaXR3aXNlIEFORCAoJikgYW55XG4gKiAgICBzcXVhcmUgd2l0aCAweDg4LCBpZiB0aGUgcmVzdWx0IGlzIG5vbi16ZXJvIHRoZW4gdGhlIHNxdWFyZSBpcyBvZmYgdGhlXG4gKiAgICBib2FyZC4gRm9yIGV4YW1wbGUsIGFzc3VtaW5nIGEga25pZ2h0IHNxdWFyZSBBOCAoMCBpbiAweDg4IG5vdGF0aW9uKSxcbiAqICAgIHRoZXJlIGFyZSA4IHBvc3NpYmxlIGRpcmVjdGlvbnMgaW4gd2hpY2ggdGhlIGtuaWdodCBjYW4gbW92ZS4gVGhlc2VcbiAqICAgIGRpcmVjdGlvbnMgYXJlIHJlbGF0aXZlIHRvIHRoZSA4eDE2IGJvYXJkIGFuZCBhcmUgc3RvcmVkIGluIHRoZVxuICogICAgUElFQ0VfT0ZGU0VUUyBtYXAuIE9uZSBwb3NzaWJsZSBtb3ZlIGlzIEE4IC0gMTggKHVwIG9uZSBzcXVhcmUsIGFuZCB0d29cbiAqICAgIHNxdWFyZXMgdG8gdGhlIGxlZnQgLSB3aGljaCBpcyBvZmYgdGhlIGJvYXJkKS4gMCAtIDE4ID0gLTE4ICYgMHg4OCA9IDB4ODhcbiAqICAgIChiZWNhdXNlIG9mIHR3by1jb21wbGVtZW50IHJlcHJlc2VudGF0aW9uIG9mIC0xOCkuIFRoZSBub24temVybyByZXN1bHRcbiAqICAgIG1lYW5zIHRoZSBzcXVhcmUgaXMgb2ZmIHRoZSBib2FyZCBhbmQgdGhlIG1vdmUgaXMgaWxsZWdhbC4gVGFrZSB0aGVcbiAqICAgIG9wcG9zaXRlIG1vdmUgKGZyb20gQTggdG8gQzcpLCAwICsgMTggPSAxOCAmIDB4ODggPSAwLiBBIHJlc3VsdCBvZiB6ZXJvXG4gKiAgICBtZWFucyB0aGUgc3F1YXJlIGlzIG9uIHRoZSBib2FyZC5cbiAqXG4gKiAyLiBUaGUgcmVsYXRpdmUgZGlzdGFuY2UgKG9yIGRpZmZlcmVuY2UpIGJldHdlZW4gdHdvIHNxdWFyZXMgb24gYSA4eDE2IGJvYXJkXG4gKiAgICBpcyB1bmlxdWUgYW5kIGNhbiBiZSB1c2VkIHRvIGluZXhwZW5zaXZlbHkgZGV0ZXJtaW5lIGlmIGEgcGllY2Ugb24gYVxuICogICAgc3F1YXJlIGNhbiBhdHRhY2sgYW55IG90aGVyIGFyYml0cmFyeSBzcXVhcmUuIEZvciBleGFtcGxlLCBsZXQncyBzZWUgaWYgYVxuICogICAgcGF3biBvbiBFNyBjYW4gYXR0YWNrIEUyLiBUaGUgZGlmZmVyZW5jZSBiZXR3ZWVuIEU3ICgyMCkgLSBFMiAoMTAwKSBpc1xuICogICAgLTgwLiBXZSBhZGQgMTE5IHRvIG1ha2UgdGhlIEFUVEFDS1MgYXJyYXkgaW5kZXggbm9uLW5lZ2F0aXZlIChiZWNhdXNlIHRoZVxuICogICAgd29yc3QgY2FzZSBkaWZmZXJlbmNlIGlzIEE4IC0gSDEgPSAtMTE5KS4gVGhlIEFUVEFDS1MgYXJyYXkgY29udGFpbnMgYVxuICogICAgYml0bWFzayBvZiBwaWVjZXMgdGhhdCBjYW4gYXR0YWNrIGZyb20gdGhhdCBkaXN0YW5jZSBhbmQgZGlyZWN0aW9uLlxuICogICAgQVRUQUNLU1stODAgKyAxMTk9MzldIGdpdmVzIHVzIDI0IG9yIDBiMTEwMDAgaW4gYmluYXJ5LiBMb29rIGF0IHRoZVxuICogICAgUElFQ0VfTUFTS1MgbWFwIHRvIGRldGVybWluZSB0aGUgbWFzayBmb3IgYSBnaXZlbiBwaWVjZSB0eXBlLiBJbiBvdXIgcGF3blxuICogICAgZXhhbXBsZSwgd2Ugd291bGQgY2hlY2sgdG8gc2VlIGlmIDI0ICYgMHgxIGlzIG5vbi16ZXJvLCB3aGljaCBpdCBpc1xuICogICAgbm90LiBTbywgbmF0dXJhbGx5LCBhIHBhd24gb24gRTcgY2FuJ3QgYXR0YWNrIGEgcGllY2Ugb24gRTIuIEhvd2V2ZXIsIGFcbiAqICAgIHJvb2sgY2FuIHNpbmNlIDI0ICYgMHg4IGlzIG5vbi16ZXJvLiBUaGUgb25seSB0aGluZyBsZWZ0IHRvIGNoZWNrIGlzIHRoYXRcbiAqICAgIHRoZXJlIGFyZSBubyBibG9ja2luZyBwaWVjZXMgYmV0d2VlbiBFNyBhbmQgRTIuIFRoYXQncyB3aGVyZSB0aGUgUkFZU1xuICogICAgYXJyYXkgY29tZXMgaW4uIEl0IHByb3ZpZGVzIGFuIG9mZnNldCAoaW4gdGhpcyBjYXNlIDE2KSB0byBhZGQgdG8gRTcgKDIwKVxuICogICAgdG8gY2hlY2sgZm9yIGJsb2NraW5nIHBpZWNlcy4gRTcgKDIwKSArIDE2ID0gRTYgKDM2KSArIDE2ID0gRTUgKDUyKSBldGMuXG4gKi9cbi8vIHByZXR0aWVyLWlnbm9yZVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5jb25zdCBPeDg4ID0ge1xuICAgIGE4OiAwLCBiODogMSwgYzg6IDIsIGQ4OiAzLCBlODogNCwgZjg6IDUsIGc4OiA2LCBoODogNyxcbiAgICBhNzogMTYsIGI3OiAxNywgYzc6IDE4LCBkNzogMTksIGU3OiAyMCwgZjc6IDIxLCBnNzogMjIsIGg3OiAyMyxcbiAgICBhNjogMzIsIGI2OiAzMywgYzY6IDM0LCBkNjogMzUsIGU2OiAzNiwgZjY6IDM3LCBnNjogMzgsIGg2OiAzOSxcbiAgICBhNTogNDgsIGI1OiA0OSwgYzU6IDUwLCBkNTogNTEsIGU1OiA1MiwgZjU6IDUzLCBnNTogNTQsIGg1OiA1NSxcbiAgICBhNDogNjQsIGI0OiA2NSwgYzQ6IDY2LCBkNDogNjcsIGU0OiA2OCwgZjQ6IDY5LCBnNDogNzAsIGg0OiA3MSxcbiAgICBhMzogODAsIGIzOiA4MSwgYzM6IDgyLCBkMzogODMsIGUzOiA4NCwgZjM6IDg1LCBnMzogODYsIGgzOiA4NyxcbiAgICBhMjogOTYsIGIyOiA5NywgYzI6IDk4LCBkMjogOTksIGUyOiAxMDAsIGYyOiAxMDEsIGcyOiAxMDIsIGgyOiAxMDMsXG4gICAgYTE6IDExMiwgYjE6IDExMywgYzE6IDExNCwgZDE6IDExNSwgZTE6IDExNiwgZjE6IDExNywgZzE6IDExOCwgaDE6IDExOVxufTtcbmNvbnN0IFBBV05fT0ZGU0VUUyA9IHtcbiAgICBiOiBbMTYsIDMyLCAxNywgMTVdLFxuICAgIHc6IFstMTYsIC0zMiwgLTE3LCAtMTVdLFxufTtcbmNvbnN0IFBJRUNFX09GRlNFVFMgPSB7XG4gICAgbjogWy0xOCwgLTMzLCAtMzEsIC0xNCwgMTgsIDMzLCAzMSwgMTRdLFxuICAgIGI6IFstMTcsIC0xNSwgMTcsIDE1XSxcbiAgICByOiBbLTE2LCAxLCAxNiwgLTFdLFxuICAgIHE6IFstMTcsIC0xNiwgLTE1LCAxLCAxNywgMTYsIDE1LCAtMV0sXG4gICAgazogWy0xNywgLTE2LCAtMTUsIDEsIDE3LCAxNiwgMTUsIC0xXSxcbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbmNvbnN0IEFUVEFDS1MgPSBbXG4gICAgMjAsIDAsIDAsIDAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAwLCAwLCAwLCAyMCwgMCxcbiAgICAwLCAyMCwgMCwgMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDAsIDAsIDIwLCAwLCAwLFxuICAgIDAsIDAsIDIwLCAwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMCwgMjAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMjAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAyMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAyMCwgMCwgMCwgMjQsIDAsIDAsIDIwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDIwLCAyLCAyNCwgMiwgMjAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgMiwgNTMsIDU2LCA1MywgMiwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCA1NiwgMCwgNTYsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgMiwgNTMsIDU2LCA1MywgMiwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAyMCwgMiwgMjQsIDIsIDIwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDIwLCAwLCAwLCAyNCwgMCwgMCwgMjAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMjAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAyMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAyMCwgMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDAsIDIwLCAwLCAwLCAwLFxuICAgIDAsIDIwLCAwLCAwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMCwgMCwgMjAsIDAsIDAsXG4gICAgMjAsIDAsIDAsIDAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAwLCAwLCAwLCAyMFxuXTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuY29uc3QgUkFZUyA9IFtcbiAgICAxNywgMCwgMCwgMCwgMCwgMCwgMCwgMTYsIDAsIDAsIDAsIDAsIDAsIDAsIDE1LCAwLFxuICAgIDAsIDE3LCAwLCAwLCAwLCAwLCAwLCAxNiwgMCwgMCwgMCwgMCwgMCwgMTUsIDAsIDAsXG4gICAgMCwgMCwgMTcsIDAsIDAsIDAsIDAsIDE2LCAwLCAwLCAwLCAwLCAxNSwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAxNywgMCwgMCwgMCwgMTYsIDAsIDAsIDAsIDE1LCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDE3LCAwLCAwLCAxNiwgMCwgMCwgMTUsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgMTcsIDAsIDE2LCAwLCAxNSwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAwLCAxNywgMTYsIDE1LCAwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDAsIC0xNSwgLTE2LCAtMTcsIDAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgLTE1LCAwLCAtMTYsIDAsIC0xNywgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAtMTUsIDAsIDAsIC0xNiwgMCwgMCwgLTE3LCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIC0xNSwgMCwgMCwgMCwgLTE2LCAwLCAwLCAwLCAtMTcsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgLTE1LCAwLCAwLCAwLCAwLCAtMTYsIDAsIDAsIDAsIDAsIC0xNywgMCwgMCwgMCxcbiAgICAwLCAtMTUsIDAsIDAsIDAsIDAsIDAsIC0xNiwgMCwgMCwgMCwgMCwgMCwgLTE3LCAwLCAwLFxuICAgIC0xNSwgMCwgMCwgMCwgMCwgMCwgMCwgLTE2LCAwLCAwLCAwLCAwLCAwLCAwLCAtMTdcbl07XG5jb25zdCBQSUVDRV9NQVNLUyA9IHsgcDogMHgxLCBuOiAweDIsIGI6IDB4NCwgcjogMHg4LCBxOiAweDEwLCBrOiAweDIwIH07XG5jb25zdCBTWU1CT0xTID0gJ3BuYnJxa1BOQlJRSyc7XG5jb25zdCBQUk9NT1RJT05TID0gW0tOSUdIVCwgQklTSE9QLCBST09LLCBRVUVFTl07XG5jb25zdCBSQU5LXzEgPSA3O1xuY29uc3QgUkFOS18yID0gNjtcbi8qXG4gKiBjb25zdCBSQU5LXzMgPSA1XG4gKiBjb25zdCBSQU5LXzQgPSA0XG4gKiBjb25zdCBSQU5LXzUgPSAzXG4gKiBjb25zdCBSQU5LXzYgPSAyXG4gKi9cbmNvbnN0IFJBTktfNyA9IDE7XG5jb25zdCBSQU5LXzggPSAwO1xuY29uc3QgU0lERVMgPSB7XG4gICAgW0tJTkddOiBCSVRTLktTSURFX0NBU1RMRSxcbiAgICBbUVVFRU5dOiBCSVRTLlFTSURFX0NBU1RMRSxcbn07XG5jb25zdCBST09LUyA9IHtcbiAgICB3OiBbXG4gICAgICAgIHsgc3F1YXJlOiBPeDg4LmExLCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRSB9LFxuICAgICAgICB7IHNxdWFyZTogT3g4OC5oMSwgZmxhZzogQklUUy5LU0lERV9DQVNUTEUgfSxcbiAgICBdLFxuICAgIGI6IFtcbiAgICAgICAgeyBzcXVhcmU6IE94ODguYTgsIGZsYWc6IEJJVFMuUVNJREVfQ0FTVExFIH0sXG4gICAgICAgIHsgc3F1YXJlOiBPeDg4Lmg4LCBmbGFnOiBCSVRTLktTSURFX0NBU1RMRSB9LFxuICAgIF0sXG59O1xuY29uc3QgU0VDT05EX1JBTksgPSB7IGI6IFJBTktfNywgdzogUkFOS18yIH07XG5jb25zdCBURVJNSU5BVElPTl9NQVJLRVJTID0gWycxLTAnLCAnMC0xJywgJzEvMi0xLzInLCAnKiddO1xuLy8gRXh0cmFjdHMgdGhlIHplcm8tYmFzZWQgcmFuayBvZiBhbiAweDg4IHNxdWFyZS5cbmZ1bmN0aW9uIHJhbmsoc3F1YXJlKSB7XG4gICAgcmV0dXJuIHNxdWFyZSA+PiA0O1xufVxuLy8gRXh0cmFjdHMgdGhlIHplcm8tYmFzZWQgZmlsZSBvZiBhbiAweDg4IHNxdWFyZS5cbmZ1bmN0aW9uIGZpbGUoc3F1YXJlKSB7XG4gICAgcmV0dXJuIHNxdWFyZSAmIDB4Zjtcbn1cbmZ1bmN0aW9uIGlzRGlnaXQoYykge1xuICAgIHJldHVybiAnMDEyMzQ1Njc4OScuaW5kZXhPZihjKSAhPT0gLTE7XG59XG4vLyBDb252ZXJ0cyBhIDB4ODggc3F1YXJlIHRvIGFsZ2VicmFpYyBub3RhdGlvbi5cbmZ1bmN0aW9uIGFsZ2VicmFpYyhzcXVhcmUpIHtcbiAgICBjb25zdCBmID0gZmlsZShzcXVhcmUpO1xuICAgIGNvbnN0IHIgPSByYW5rKHNxdWFyZSk7XG4gICAgcmV0dXJuICgnYWJjZGVmZ2gnLnN1YnN0cmluZyhmLCBmICsgMSkgK1xuICAgICAgICAnODc2NTQzMjEnLnN1YnN0cmluZyhyLCByICsgMSkpO1xufVxuZnVuY3Rpb24gc3dhcENvbG9yKGNvbG9yKSB7XG4gICAgcmV0dXJuIGNvbG9yID09PSBXSElURSA/IEJMQUNLIDogV0hJVEU7XG59XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVGZW4oZmVuKSB7XG4gICAgLy8gMXN0IGNyaXRlcmlvbjogNiBzcGFjZS1zZXBlcmF0ZWQgZmllbGRzP1xuICAgIGNvbnN0IHRva2VucyA9IGZlbi5zcGxpdCgvXFxzKy8pO1xuICAgIGlmICh0b2tlbnMubGVuZ3RoICE9PSA2KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogJ0ludmFsaWQgRkVOOiBtdXN0IGNvbnRhaW4gc2l4IHNwYWNlLWRlbGltaXRlZCBmaWVsZHMnLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyAybmQgY3JpdGVyaW9uOiBtb3ZlIG51bWJlciBmaWVsZCBpcyBhIGludGVnZXIgdmFsdWUgPiAwP1xuICAgIGNvbnN0IG1vdmVOdW1iZXIgPSBwYXJzZUludCh0b2tlbnNbNV0sIDEwKTtcbiAgICBpZiAoaXNOYU4obW92ZU51bWJlcikgfHwgbW92ZU51bWJlciA8PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogJ0ludmFsaWQgRkVOOiBtb3ZlIG51bWJlciBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcicsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIDNyZCBjcml0ZXJpb246IGhhbGYgbW92ZSBjb3VudGVyIGlzIGFuIGludGVnZXIgPj0gMD9cbiAgICBjb25zdCBoYWxmTW92ZXMgPSBwYXJzZUludCh0b2tlbnNbNF0sIDEwKTtcbiAgICBpZiAoaXNOYU4oaGFsZk1vdmVzKSB8fCBoYWxmTW92ZXMgPCAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogJ0ludmFsaWQgRkVOOiBoYWxmIG1vdmUgY291bnRlciBudW1iZXIgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyJyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gNHRoIGNyaXRlcmlvbjogNHRoIGZpZWxkIGlzIGEgdmFsaWQgZS5wLi1zdHJpbmc/XG4gICAgaWYgKCEvXigtfFthYmNkZWZnaF1bMzZdKSQvLnRlc3QodG9rZW5zWzNdKSkge1xuICAgICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBGRU46IGVuLXBhc3NhbnQgc3F1YXJlIGlzIGludmFsaWQnIH07XG4gICAgfVxuICAgIC8vIDV0aCBjcml0ZXJpb246IDN0aCBmaWVsZCBpcyBhIHZhbGlkIGNhc3RsZS1zdHJpbmc/XG4gICAgaWYgKC9bXmtLcVEtXS8udGVzdCh0b2tlbnNbMl0pKSB7XG4gICAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIEZFTjogY2FzdGxpbmcgYXZhaWxhYmlsaXR5IGlzIGludmFsaWQnIH07XG4gICAgfVxuICAgIC8vIDZ0aCBjcml0ZXJpb246IDJuZCBmaWVsZCBpcyBcIndcIiAod2hpdGUpIG9yIFwiYlwiIChibGFjayk/XG4gICAgaWYgKCEvXih3fGIpJC8udGVzdCh0b2tlbnNbMV0pKSB7XG4gICAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIEZFTjogc2lkZS10by1tb3ZlIGlzIGludmFsaWQnIH07XG4gICAgfVxuICAgIC8vIDd0aCBjcml0ZXJpb246IDFzdCBmaWVsZCBjb250YWlucyA4IHJvd3M/XG4gICAgY29uc3Qgcm93cyA9IHRva2Vuc1swXS5zcGxpdCgnLycpO1xuICAgIGlmIChyb3dzLmxlbmd0aCAhPT0gOCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IFwiSW52YWxpZCBGRU46IHBpZWNlIGRhdGEgZG9lcyBub3QgY29udGFpbiA4ICcvJy1kZWxpbWl0ZWQgcm93c1wiLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyA4dGggY3JpdGVyaW9uOiBldmVyeSByb3cgaXMgdmFsaWQ/XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGNoZWNrIGZvciByaWdodCBzdW0gb2YgZmllbGRzIEFORCBub3QgdHdvIG51bWJlcnMgaW4gc3VjY2Vzc2lvblxuICAgICAgICBsZXQgc3VtRmllbGRzID0gMDtcbiAgICAgICAgbGV0IHByZXZpb3VzV2FzTnVtYmVyID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcm93c1tpXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgaWYgKGlzRGlnaXQocm93c1tpXVtrXSkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNXYXNOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBGRU46IHBpZWNlIGRhdGEgaXMgaW52YWxpZCAoY29uc2VjdXRpdmUgbnVtYmVyKScsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1bUZpZWxkcyArPSBwYXJzZUludChyb3dzW2ldW2tdLCAxMCk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNXYXNOdW1iZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCEvXltwcm5icWtQUk5CUUtdJC8udGVzdChyb3dzW2ldW2tdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIEZFTjogcGllY2UgZGF0YSBpcyBpbnZhbGlkIChpbnZhbGlkIHBpZWNlKScsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1bUZpZWxkcyArPSAxO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzV2FzTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1bUZpZWxkcyAhPT0gOCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIEZFTjogcGllY2UgZGF0YSBpcyBpbnZhbGlkICh0b28gbWFueSBzcXVhcmVzIGluIHJhbmspJyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gOXRoIGNyaXRlcmlvbjogaXMgZW4tcGFzc2FudCBzcXVhcmUgbGVnYWw/XG4gICAgaWYgKCh0b2tlbnNbM11bMV0gPT0gJzMnICYmIHRva2Vuc1sxXSA9PSAndycpIHx8XG4gICAgICAgICh0b2tlbnNbM11bMV0gPT0gJzYnICYmIHRva2Vuc1sxXSA9PSAnYicpKSB7XG4gICAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIEZFTjogaWxsZWdhbCBlbi1wYXNzYW50IHNxdWFyZScgfTtcbiAgICB9XG4gICAgLy8gMTB0aCBjcml0ZXJpb246IGRvZXMgY2hlc3MgcG9zaXRpb24gY29udGFpbiBleGFjdCB0d28ga2luZ3M/XG4gICAgY29uc3Qga2luZ3MgPSBbXG4gICAgICAgIHsgY29sb3I6ICd3aGl0ZScsIHJlZ2V4OiAvSy9nIH0sXG4gICAgICAgIHsgY29sb3I6ICdibGFjaycsIHJlZ2V4OiAvay9nIH0sXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IHsgY29sb3IsIHJlZ2V4IH0gb2Yga2luZ3MpIHtcbiAgICAgICAgaWYgKCFyZWdleC50ZXN0KHRva2Vuc1swXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6IGBJbnZhbGlkIEZFTjogbWlzc2luZyAke2NvbG9yfSBraW5nYCB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICgodG9rZW5zWzBdLm1hdGNoKHJlZ2V4KSB8fCBbXSkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogYEludmFsaWQgRkVOOiB0b28gbWFueSAke2NvbG9yfSBraW5nc2AgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAxMXRoIGNyaXRlcmlvbjogYXJlIGFueSBwYXducyBvbiB0aGUgZmlyc3Qgb3IgZWlnaHRoIHJvd3M/XG4gICAgaWYgKEFycmF5LmZyb20ocm93c1swXSArIHJvd3NbN10pLnNvbWUoKGNoYXIpID0+IGNoYXIudG9VcHBlckNhc2UoKSA9PT0gJ1AnKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIEZFTjogc29tZSBwYXducyBhcmUgb24gdGhlIGVkZ2Ugcm93cycsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7IG9rOiB0cnVlIH07XG59XG4vLyB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgYW1iaWd1b3VzIG1vdmVzXG5mdW5jdGlvbiBnZXREaXNhbWJpZ3VhdG9yKG1vdmUsIG1vdmVzKSB7XG4gICAgY29uc3QgZnJvbSA9IG1vdmUuZnJvbTtcbiAgICBjb25zdCB0byA9IG1vdmUudG87XG4gICAgY29uc3QgcGllY2UgPSBtb3ZlLnBpZWNlO1xuICAgIGxldCBhbWJpZ3VpdGllcyA9IDA7XG4gICAgbGV0IHNhbWVSYW5rID0gMDtcbiAgICBsZXQgc2FtZUZpbGUgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBhbWJpZ0Zyb20gPSBtb3Zlc1tpXS5mcm9tO1xuICAgICAgICBjb25zdCBhbWJpZ1RvID0gbW92ZXNbaV0udG87XG4gICAgICAgIGNvbnN0IGFtYmlnUGllY2UgPSBtb3Zlc1tpXS5waWVjZTtcbiAgICAgICAgLypcbiAgICAgICAgICogaWYgYSBtb3ZlIG9mIHRoZSBzYW1lIHBpZWNlIHR5cGUgZW5kcyBvbiB0aGUgc2FtZSB0byBzcXVhcmUsIHdlJ2xsIG5lZWRcbiAgICAgICAgICogdG8gYWRkIGEgZGlzYW1iaWd1YXRvciB0byB0aGUgYWxnZWJyYWljIG5vdGF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBpZiAocGllY2UgPT09IGFtYmlnUGllY2UgJiYgZnJvbSAhPT0gYW1iaWdGcm9tICYmIHRvID09PSBhbWJpZ1RvKSB7XG4gICAgICAgICAgICBhbWJpZ3VpdGllcysrO1xuICAgICAgICAgICAgaWYgKHJhbmsoZnJvbSkgPT09IHJhbmsoYW1iaWdGcm9tKSkge1xuICAgICAgICAgICAgICAgIHNhbWVSYW5rKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsZShmcm9tKSA9PT0gZmlsZShhbWJpZ0Zyb20pKSB7XG4gICAgICAgICAgICAgICAgc2FtZUZpbGUrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYW1iaWd1aXRpZXMgPiAwKSB7XG4gICAgICAgIGlmIChzYW1lUmFuayA+IDAgJiYgc2FtZUZpbGUgPiAwKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogaWYgdGhlcmUgZXhpc3RzIGEgc2ltaWxhciBtb3ZpbmcgcGllY2Ugb24gdGhlIHNhbWUgcmFuayBhbmQgZmlsZSBhc1xuICAgICAgICAgICAgICogdGhlIG1vdmUgaW4gcXVlc3Rpb24sIHVzZSB0aGUgc3F1YXJlIGFzIHRoZSBkaXNhbWJpZ3VhdG9yXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2FtZUZpbGUgPiAwKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogaWYgdGhlIG1vdmluZyBwaWVjZSByZXN0cyBvbiB0aGUgc2FtZSBmaWxlLCB1c2UgdGhlIHJhbmsgc3ltYm9sIGFzIHRoZVxuICAgICAgICAgICAgICogZGlzYW1iaWd1YXRvclxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pLmNoYXJBdCgxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVsc2UgdXNlIHRoZSBmaWxlIHN5bWJvbFxuICAgICAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKS5jaGFyQXQoMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gYWRkTW92ZShtb3ZlcywgY29sb3IsIGZyb20sIHRvLCBwaWVjZSwgY2FwdHVyZWQgPSB1bmRlZmluZWQsIGZsYWdzID0gQklUUy5OT1JNQUwpIHtcbiAgICBjb25zdCByID0gcmFuayh0byk7XG4gICAgaWYgKHBpZWNlID09PSBQQVdOICYmIChyID09PSBSQU5LXzEgfHwgciA9PT0gUkFOS184KSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFBST01PVElPTlMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb21vdGlvbiA9IFBST01PVElPTlNbaV07XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgICAgIHRvLFxuICAgICAgICAgICAgICAgIHBpZWNlLFxuICAgICAgICAgICAgICAgIGNhcHR1cmVkLFxuICAgICAgICAgICAgICAgIHByb21vdGlvbixcbiAgICAgICAgICAgICAgICBmbGFnczogZmxhZ3MgfCBCSVRTLlBST01PVElPTixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBtb3Zlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgIHRvLFxuICAgICAgICAgICAgcGllY2UsXG4gICAgICAgICAgICBjYXB0dXJlZCxcbiAgICAgICAgICAgIGZsYWdzLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBpbmZlclBpZWNlVHlwZShzYW4pIHtcbiAgICBsZXQgcGllY2VUeXBlID0gc2FuLmNoYXJBdCgwKTtcbiAgICBpZiAocGllY2VUeXBlID49ICdhJyAmJiBwaWVjZVR5cGUgPD0gJ2gnKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBzYW4ubWF0Y2goL1thLWhdXFxkLipbYS1oXVxcZC8pO1xuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUEFXTjtcbiAgICB9XG4gICAgcGllY2VUeXBlID0gcGllY2VUeXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHBpZWNlVHlwZSA9PT0gJ28nKSB7XG4gICAgICAgIHJldHVybiBLSU5HO1xuICAgIH1cbiAgICByZXR1cm4gcGllY2VUeXBlO1xufVxuLy8gcGFyc2VzIGFsbCBvZiB0aGUgZGVjb3JhdG9ycyBvdXQgb2YgYSBTQU4gc3RyaW5nXG5mdW5jdGlvbiBzdHJpcHBlZFNhbihtb3ZlKSB7XG4gICAgcmV0dXJuIG1vdmUucmVwbGFjZSgvPS8sICcnKS5yZXBsYWNlKC9bKyNdP1s/IV0qJC8sICcnKTtcbn1cbmZ1bmN0aW9uIHRyaW1GZW4oZmVuKSB7XG4gICAgLypcbiAgICAgKiByZW1vdmUgbGFzdCB0d28gZmllbGRzIGluIEZFTiBzdHJpbmcgYXMgdGhleSdyZSBub3QgbmVlZGVkIHdoZW4gY2hlY2tpbmdcbiAgICAgKiBmb3IgcmVwZXRpdGlvblxuICAgICAqL1xuICAgIHJldHVybiBmZW4uc3BsaXQoJyAnKS5zbGljZSgwLCA0KS5qb2luKCcgJyk7XG59XG5leHBvcnQgY2xhc3MgQ2hlc3Mge1xuICAgIF9ib2FyZCA9IG5ldyBBcnJheSgxMjgpO1xuICAgIF90dXJuID0gV0hJVEU7XG4gICAgX2hlYWRlciA9IHt9O1xuICAgIF9raW5ncyA9IHsgdzogRU1QVFksIGI6IEVNUFRZIH07XG4gICAgX2VwU3F1YXJlID0gLTE7XG4gICAgX2hhbGZNb3ZlcyA9IDA7XG4gICAgX21vdmVOdW1iZXIgPSAwO1xuICAgIF9oaXN0b3J5ID0gW107XG4gICAgX2NvbW1lbnRzID0ge307XG4gICAgX2Nhc3RsaW5nID0geyB3OiAwLCBiOiAwIH07XG4gICAgX3Bvc2l0aW9uQ291bnRzID0ge307XG4gICAgY29uc3RydWN0b3IoZmVuID0gREVGQVVMVF9QT1NJVElPTikge1xuICAgICAgICB0aGlzLmxvYWQoZmVuKTtcbiAgICB9XG4gICAgY2xlYXIoeyBwcmVzZXJ2ZUhlYWRlcnMgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5fYm9hcmQgPSBuZXcgQXJyYXkoMTI4KTtcbiAgICAgICAgdGhpcy5fa2luZ3MgPSB7IHc6IEVNUFRZLCBiOiBFTVBUWSB9O1xuICAgICAgICB0aGlzLl90dXJuID0gV0hJVEU7XG4gICAgICAgIHRoaXMuX2Nhc3RsaW5nID0geyB3OiAwLCBiOiAwIH07XG4gICAgICAgIHRoaXMuX2VwU3F1YXJlID0gRU1QVFk7XG4gICAgICAgIHRoaXMuX2hhbGZNb3ZlcyA9IDA7XG4gICAgICAgIHRoaXMuX21vdmVOdW1iZXIgPSAxO1xuICAgICAgICB0aGlzLl9oaXN0b3J5ID0gW107XG4gICAgICAgIHRoaXMuX2NvbW1lbnRzID0ge307XG4gICAgICAgIHRoaXMuX2hlYWRlciA9IHByZXNlcnZlSGVhZGVycyA/IHRoaXMuX2hlYWRlciA6IHt9O1xuICAgICAgICAvKlxuICAgICAgICAgKiBEZWxldGUgdGhlIFNldFVwIGFuZCBGRU4gaGVhZGVycyAoaWYgcHJlc2VydmVkKSwgdGhlIGJvYXJkIGlzIGVtcHR5IGFuZFxuICAgICAgICAgKiB0aGVzZSBoZWFkZXJzIGRvbid0IG1ha2Ugc2Vuc2UgaW4gdGhpcyBzdGF0ZS4gVGhleSdsbCBnZXQgYWRkZWQgbGF0ZXJcbiAgICAgICAgICogdmlhIC5sb2FkKCkgb3IgLnB1dCgpXG4gICAgICAgICAqL1xuICAgICAgICBkZWxldGUgdGhpcy5faGVhZGVyWydTZXRVcCddO1xuICAgICAgICBkZWxldGUgdGhpcy5faGVhZGVyWydGRU4nXTtcbiAgICAgICAgLypcbiAgICAgICAgICogSW5zdGFudGlhdGUgYSBwcm94eSB0aGF0IGtlZXBzIHRyYWNrIG9mIHBvc2l0aW9uIG9jY3VycmVuY2UgY291bnRzIGZvciB0aGUgcHVycG9zZVxuICAgICAgICAgKiBvZiByZXBldGl0aW9uIGNoZWNraW5nLiBUaGUgZ2V0dGVyIGFuZCBzZXR0ZXIgbWV0aG9kcyBhdXRvbWF0aWNhbGx5IGhhbmRsZSB0cmltbWluZ1xuICAgICAgICAgKiBpcnJlbGV2ZW50IGluZm9ybWF0aW9uIGZyb20gdGhlIGZlbiwgaW5pdGlhbGlzaW5nIG5ldyBwb3NpdGlvbnMsIGFuZCByZW1vdmluZyBvbGRcbiAgICAgICAgICogcG9zaXRpb25zIGZyb20gdGhlIHJlY29yZCBpZiB0aGVpciBjb3VudHMgYXJlIHJlZHVjZWQgdG8gMC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uQ291bnRzID0gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHBvc2l0aW9uKSA9PiBwb3NpdGlvbiA9PT0gJ2xlbmd0aCdcbiAgICAgICAgICAgICAgICA/IE9iamVjdC5rZXlzKHRhcmdldCkubGVuZ3RoIC8vIGxlbmd0aCBmb3IgdW5pdCB0ZXN0aW5nXG4gICAgICAgICAgICAgICAgOiB0YXJnZXQ/Llt0cmltRmVuKHBvc2l0aW9uKV0gfHwgMCxcbiAgICAgICAgICAgIHNldDogKHRhcmdldCwgcG9zaXRpb24sIGNvdW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbW1lZEZlbiA9IHRyaW1GZW4ocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRhcmdldFt0cmltbWVkRmVuXTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFt0cmltbWVkRmVuXSA9IGNvdW50O1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbW92ZUhlYWRlcihrZXkpIHtcbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLl9oZWFkZXIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsb2FkKGZlbiwgeyBza2lwVmFsaWRhdGlvbiA9IGZhbHNlLCBwcmVzZXJ2ZUhlYWRlcnMgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgbGV0IHRva2VucyA9IGZlbi5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAvLyBhcHBlbmQgY29tbW9ubHkgb21pdHRlZCBmZW4gdG9rZW5zXG4gICAgICAgIGlmICh0b2tlbnMubGVuZ3RoID49IDIgJiYgdG9rZW5zLmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgIGNvbnN0IGFkanVzdG1lbnRzID0gWyctJywgJy0nLCAnMCcsICcxJ107XG4gICAgICAgICAgICBmZW4gPSB0b2tlbnMuY29uY2F0KGFkanVzdG1lbnRzLnNsaWNlKC0oNiAtIHRva2Vucy5sZW5ndGgpKSkuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIHRva2VucyA9IGZlbi5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBpZiAoIXNraXBWYWxpZGF0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCB7IG9rLCBlcnJvciB9ID0gdmFsaWRhdGVGZW4oZmVuKTtcbiAgICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdG9rZW5zWzBdO1xuICAgICAgICBsZXQgc3F1YXJlID0gMDtcbiAgICAgICAgdGhpcy5jbGVhcih7IHByZXNlcnZlSGVhZGVycyB9KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGllY2UgPSBwb3NpdGlvbi5jaGFyQXQoaSk7XG4gICAgICAgICAgICBpZiAocGllY2UgPT09ICcvJykge1xuICAgICAgICAgICAgICAgIHNxdWFyZSArPSA4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNEaWdpdChwaWVjZSkpIHtcbiAgICAgICAgICAgICAgICBzcXVhcmUgKz0gcGFyc2VJbnQocGllY2UsIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcGllY2UgPCAnYScgPyBXSElURSA6IEJMQUNLO1xuICAgICAgICAgICAgICAgIHRoaXMuX3B1dCh7IHR5cGU6IHBpZWNlLnRvTG93ZXJDYXNlKCksIGNvbG9yIH0sIGFsZ2VicmFpYyhzcXVhcmUpKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90dXJuID0gdG9rZW5zWzFdO1xuICAgICAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ0snKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy53IHw9IEJJVFMuS1NJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignUScpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLncgfD0gQklUUy5RU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdrJykgPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcuYiB8PSBCSVRTLktTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ3EnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy5iIHw9IEJJVFMuUVNJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VwU3F1YXJlID0gdG9rZW5zWzNdID09PSAnLScgPyBFTVBUWSA6IE94ODhbdG9rZW5zWzNdXTtcbiAgICAgICAgdGhpcy5faGFsZk1vdmVzID0gcGFyc2VJbnQodG9rZW5zWzRdLCAxMCk7XG4gICAgICAgIHRoaXMuX21vdmVOdW1iZXIgPSBwYXJzZUludCh0b2tlbnNbNV0sIDEwKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2V0dXAoZmVuKTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25Db3VudHNbZmVuXSsrO1xuICAgIH1cbiAgICBmZW4oKSB7XG4gICAgICAgIGxldCBlbXB0eSA9IDA7XG4gICAgICAgIGxldCBmZW4gPSAnJztcbiAgICAgICAgZm9yIChsZXQgaSA9IE94ODguYTg7IGkgPD0gT3g4OC5oMTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbaV0pIHtcbiAgICAgICAgICAgICAgICBpZiAoZW1wdHkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZlbiArPSBlbXB0eTtcbiAgICAgICAgICAgICAgICAgICAgZW1wdHkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB7IGNvbG9yLCB0eXBlOiBwaWVjZSB9ID0gdGhpcy5fYm9hcmRbaV07XG4gICAgICAgICAgICAgICAgZmVuICs9IGNvbG9yID09PSBXSElURSA/IHBpZWNlLnRvVXBwZXJDYXNlKCkgOiBwaWVjZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZW1wdHkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoaSArIDEpICYgMHg4OCkge1xuICAgICAgICAgICAgICAgIGlmIChlbXB0eSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmVuICs9IGVtcHR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaSAhPT0gT3g4OC5oMSkge1xuICAgICAgICAgICAgICAgICAgICBmZW4gKz0gJy8nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbXB0eSA9IDA7XG4gICAgICAgICAgICAgICAgaSArPSA4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBjYXN0bGluZyA9ICcnO1xuICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbV0hJVEVdICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgIGNhc3RsaW5nICs9ICdLJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbV0hJVEVdICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgIGNhc3RsaW5nICs9ICdRJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbQkxBQ0tdICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgIGNhc3RsaW5nICs9ICdrJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbQkxBQ0tdICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgIGNhc3RsaW5nICs9ICdxJztcbiAgICAgICAgfVxuICAgICAgICAvLyBkbyB3ZSBoYXZlIGFuIGVtcHR5IGNhc3RsaW5nIGZsYWc/XG4gICAgICAgIGNhc3RsaW5nID0gY2FzdGxpbmcgfHwgJy0nO1xuICAgICAgICBsZXQgZXBTcXVhcmUgPSAnLSc7XG4gICAgICAgIC8qXG4gICAgICAgICAqIG9ubHkgcHJpbnQgdGhlIGVwIHNxdWFyZSBpZiBlbiBwYXNzYW50IGlzIGEgdmFsaWQgbW92ZSAocGF3biBpcyBwcmVzZW50XG4gICAgICAgICAqIGFuZCBlcCBjYXB0dXJlIGlzIG5vdCBwaW5uZWQpXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5fZXBTcXVhcmUgIT09IEVNUFRZKSB7XG4gICAgICAgICAgICBjb25zdCBiaWdQYXduU3F1YXJlID0gdGhpcy5fZXBTcXVhcmUgKyAodGhpcy5fdHVybiA9PT0gV0hJVEUgPyAxNiA6IC0xNik7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzID0gW2JpZ1Bhd25TcXVhcmUgKyAxLCBiaWdQYXduU3F1YXJlIC0gMV07XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNxdWFyZSBvZiBzcXVhcmVzKSB7XG4gICAgICAgICAgICAgICAgLy8gaXMgdGhlIHNxdWFyZSBvZmYgdGhlIGJvYXJkP1xuICAgICAgICAgICAgICAgIGlmIChzcXVhcmUgJiAweDg4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IHRoaXMuX3R1cm47XG4gICAgICAgICAgICAgICAgLy8gaXMgdGhlcmUgYSBwYXduIHRoYXQgY2FuIGNhcHR1cmUgdGhlIGVwU3F1YXJlP1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFtzcXVhcmVdPy5jb2xvciA9PT0gY29sb3IgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9hcmRbc3F1YXJlXT8udHlwZSA9PT0gUEFXTikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcGF3biBtYWtlcyBhbiBlcCBjYXB0dXJlLCBkb2VzIGl0IGxlYXZlIGl0J3Mga2luZyBpbiBjaGVjaz9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFrZU1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBzcXVhcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogdGhpcy5fZXBTcXVhcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZTogUEFXTixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmVkOiBQQVdOLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ3M6IEJJVFMuRVBfQ0FQVFVSRSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzTGVnYWwgPSAhdGhpcy5faXNLaW5nQXR0YWNrZWQoY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91bmRvTW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBlcCBpcyBsZWdhbCwgYnJlYWsgYW5kIHNldCB0aGUgZXAgc3F1YXJlIGluIHRoZSBGRU4gb3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0xlZ2FsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcFNxdWFyZSA9IGFsZ2VicmFpYyh0aGlzLl9lcFNxdWFyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgZmVuLFxuICAgICAgICAgICAgdGhpcy5fdHVybixcbiAgICAgICAgICAgIGNhc3RsaW5nLFxuICAgICAgICAgICAgZXBTcXVhcmUsXG4gICAgICAgICAgICB0aGlzLl9oYWxmTW92ZXMsXG4gICAgICAgICAgICB0aGlzLl9tb3ZlTnVtYmVyLFxuICAgICAgICBdLmpvaW4oJyAnKTtcbiAgICB9XG4gICAgLypcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgaW5pdGlhbCBib2FyZCBzZXR1cCBpcyBjaGFuZ2VkIHdpdGggcHV0KCkgb3IgcmVtb3ZlKCkuXG4gICAgICogbW9kaWZpZXMgdGhlIFNldFVwIGFuZCBGRU4gcHJvcGVydGllcyBvZiB0aGUgaGVhZGVyIG9iamVjdC4gSWYgdGhlIEZFTlxuICAgICAqIGlzIGVxdWFsIHRvIHRoZSBkZWZhdWx0IHBvc2l0aW9uLCB0aGUgU2V0VXAgYW5kIEZFTiBhcmUgZGVsZXRlZCB0aGUgc2V0dXBcbiAgICAgKiBpcyBvbmx5IHVwZGF0ZWQgaWYgaGlzdG9yeS5sZW5ndGggaXMgemVybywgaWUgbW92ZXMgaGF2ZW4ndCBiZWVuIG1hZGUuXG4gICAgICovXG4gICAgX3VwZGF0ZVNldHVwKGZlbikge1xuICAgICAgICBpZiAodGhpcy5faGlzdG9yeS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAoZmVuICE9PSBERUZBVUxUX1BPU0lUSU9OKSB7XG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJbJ1NldFVwJ10gPSAnMSc7XG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJbJ0ZFTiddID0gZmVuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlclsnU2V0VXAnXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJbJ0ZFTiddO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmxvYWQoREVGQVVMVF9QT1NJVElPTik7XG4gICAgfVxuICAgIGdldChzcXVhcmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkW094ODhbc3F1YXJlXV0gfHwgZmFsc2U7XG4gICAgfVxuICAgIHB1dCh7IHR5cGUsIGNvbG9yIH0sIHNxdWFyZSkge1xuICAgICAgICBpZiAodGhpcy5fcHV0KHsgdHlwZSwgY29sb3IgfSwgc3F1YXJlKSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2FzdGxpbmdSaWdodHMoKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUVuUGFzc2FudFNxdWFyZSgpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU2V0dXAodGhpcy5mZW4oKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9wdXQoeyB0eXBlLCBjb2xvciB9LCBzcXVhcmUpIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIHBpZWNlXG4gICAgICAgIGlmIChTWU1CT0xTLmluZGV4T2YodHlwZS50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBmb3IgdmFsaWQgc3F1YXJlXG4gICAgICAgIGlmICghKHNxdWFyZSBpbiBPeDg4KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNxID0gT3g4OFtzcXVhcmVdO1xuICAgICAgICAvLyBkb24ndCBsZXQgdGhlIHVzZXIgcGxhY2UgbW9yZSB0aGFuIG9uZSBraW5nXG4gICAgICAgIGlmICh0eXBlID09IEtJTkcgJiZcbiAgICAgICAgICAgICEodGhpcy5fa2luZ3NbY29sb3JdID09IEVNUFRZIHx8IHRoaXMuX2tpbmdzW2NvbG9yXSA9PSBzcSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyZW50UGllY2VPblNxdWFyZSA9IHRoaXMuX2JvYXJkW3NxXTtcbiAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBraW5ncyB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoZSBwaWVjZSBmcm9tIGFyZ3MsIHNldCB0aGUgYF9raW5nc2AgcmVzcGVjdGl2ZSBlbnRyeSB0byBgRU1QVFlgXG4gICAgICAgIGlmIChjdXJyZW50UGllY2VPblNxdWFyZSAmJiBjdXJyZW50UGllY2VPblNxdWFyZS50eXBlID09PSBLSU5HKSB7XG4gICAgICAgICAgICB0aGlzLl9raW5nc1tjdXJyZW50UGllY2VPblNxdWFyZS5jb2xvcl0gPSBFTVBUWTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ib2FyZFtzcV0gPSB7IHR5cGU6IHR5cGUsIGNvbG9yOiBjb2xvciB9O1xuICAgICAgICBpZiAodHlwZSA9PT0gS0lORykge1xuICAgICAgICAgICAgdGhpcy5fa2luZ3NbY29sb3JdID0gc3E7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJlbW92ZShzcXVhcmUpIHtcbiAgICAgICAgY29uc3QgcGllY2UgPSB0aGlzLmdldChzcXVhcmUpO1xuICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbT3g4OFtzcXVhcmVdXTtcbiAgICAgICAgaWYgKHBpZWNlICYmIHBpZWNlLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgICAgICAgIHRoaXMuX2tpbmdzW3BpZWNlLmNvbG9yXSA9IEVNUFRZO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNhc3RsaW5nUmlnaHRzKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUVuUGFzc2FudFNxdWFyZSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVTZXR1cCh0aGlzLmZlbigpKTtcbiAgICAgICAgcmV0dXJuIHBpZWNlO1xuICAgIH1cbiAgICBfdXBkYXRlQ2FzdGxpbmdSaWdodHMoKSB7XG4gICAgICAgIGNvbnN0IHdoaXRlS2luZ0luUGxhY2UgPSB0aGlzLl9ib2FyZFtPeDg4LmUxXT8udHlwZSA9PT0gS0lORyAmJlxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5lMV0/LmNvbG9yID09PSBXSElURTtcbiAgICAgICAgY29uc3QgYmxhY2tLaW5nSW5QbGFjZSA9IHRoaXMuX2JvYXJkW094ODguZThdPy50eXBlID09PSBLSU5HICYmXG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmU4XT8uY29sb3IgPT09IEJMQUNLO1xuICAgICAgICBpZiAoIXdoaXRlS2luZ0luUGxhY2UgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguYTFdPy50eXBlICE9PSBST09LIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmExXT8uY29sb3IgIT09IFdISVRFKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy53ICY9IH5CSVRTLlFTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXdoaXRlS2luZ0luUGxhY2UgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguaDFdPy50eXBlICE9PSBST09LIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmgxXT8uY29sb3IgIT09IFdISVRFKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy53ICY9IH5CSVRTLktTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJsYWNrS2luZ0luUGxhY2UgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguYThdPy50eXBlICE9PSBST09LIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmE4XT8uY29sb3IgIT09IEJMQUNLKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy5iICY9IH5CSVRTLlFTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJsYWNrS2luZ0luUGxhY2UgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguaDhdPy50eXBlICE9PSBST09LIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4Lmg4XT8uY29sb3IgIT09IEJMQUNLKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy5iICY9IH5CSVRTLktTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfdXBkYXRlRW5QYXNzYW50U3F1YXJlKCkge1xuICAgICAgICBpZiAodGhpcy5fZXBTcXVhcmUgPT09IEVNUFRZKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhcnRTcXVhcmUgPSB0aGlzLl9lcFNxdWFyZSArICh0aGlzLl90dXJuID09PSBXSElURSA/IC0xNiA6IDE2KTtcbiAgICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IHRoaXMuX2VwU3F1YXJlICsgKHRoaXMuX3R1cm4gPT09IFdISVRFID8gMTYgOiAtMTYpO1xuICAgICAgICBjb25zdCBhdHRhY2tlcnMgPSBbY3VycmVudFNxdWFyZSArIDEsIGN1cnJlbnRTcXVhcmUgLSAxXTtcbiAgICAgICAgaWYgKHRoaXMuX2JvYXJkW3N0YXJ0U3F1YXJlXSAhPT0gbnVsbCB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbdGhpcy5fZXBTcXVhcmVdICE9PSBudWxsIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtjdXJyZW50U3F1YXJlXT8uY29sb3IgIT09IHN3YXBDb2xvcih0aGlzLl90dXJuKSB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbY3VycmVudFNxdWFyZV0/LnR5cGUgIT09IFBBV04pIHtcbiAgICAgICAgICAgIHRoaXMuX2VwU3F1YXJlID0gRU1QVFk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2FuQ2FwdHVyZSA9IChzcXVhcmUpID0+ICEoc3F1YXJlICYgMHg4OCkgJiZcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW3NxdWFyZV0/LmNvbG9yID09PSB0aGlzLl90dXJuICYmXG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtzcXVhcmVdPy50eXBlID09PSBQQVdOO1xuICAgICAgICBpZiAoIWF0dGFja2Vycy5zb21lKGNhbkNhcHR1cmUpKSB7XG4gICAgICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IEVNUFRZO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9hdHRhY2tlZChjb2xvciwgc3F1YXJlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSBPeDg4LmE4OyBpIDw9IE94ODguaDE7IGkrKykge1xuICAgICAgICAgICAgLy8gZGlkIHdlIHJ1biBvZmYgdGhlIGVuZCBvZiB0aGUgYm9hcmRcbiAgICAgICAgICAgIGlmIChpICYgMHg4OCkge1xuICAgICAgICAgICAgICAgIGkgKz0gNztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGVtcHR5IHNxdWFyZSBvciB3cm9uZyBjb2xvclxuICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW2ldID09PSB1bmRlZmluZWQgfHwgdGhpcy5fYm9hcmRbaV0uY29sb3IgIT09IGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwaWVjZSA9IHRoaXMuX2JvYXJkW2ldO1xuICAgICAgICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IGkgLSBzcXVhcmU7XG4gICAgICAgICAgICAvLyBza2lwIC0gdG8vZnJvbSBzcXVhcmUgYXJlIHRoZSBzYW1lXG4gICAgICAgICAgICBpZiAoZGlmZmVyZW5jZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBkaWZmZXJlbmNlICsgMTE5O1xuICAgICAgICAgICAgaWYgKEFUVEFDS1NbaW5kZXhdICYgUElFQ0VfTUFTS1NbcGllY2UudHlwZV0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gUEFXTikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZmVyZW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwaWVjZS5jb2xvciA9PT0gV0hJVEUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGllY2UuY29sb3IgPT09IEJMQUNLKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcGllY2UgaXMgYSBrbmlnaHQgb3IgYSBraW5nXG4gICAgICAgICAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09ICduJyB8fCBwaWVjZS50eXBlID09PSAnaycpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IFJBWVNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBqID0gaSArIG9mZnNldDtcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHdoaWxlIChqICE9PSBzcXVhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW2pdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaiArPSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghYmxvY2tlZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfaXNLaW5nQXR0YWNrZWQoY29sb3IpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gdGhpcy5fa2luZ3NbY29sb3JdO1xuICAgICAgICByZXR1cm4gc3F1YXJlID09PSAtMSA/IGZhbHNlIDogdGhpcy5fYXR0YWNrZWQoc3dhcENvbG9yKGNvbG9yKSwgc3F1YXJlKTtcbiAgICB9XG4gICAgaXNBdHRhY2tlZChzcXVhcmUsIGF0dGFja2VkQnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFja2VkKGF0dGFja2VkQnksIE94ODhbc3F1YXJlXSk7XG4gICAgfVxuICAgIGlzQ2hlY2soKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0tpbmdBdHRhY2tlZCh0aGlzLl90dXJuKTtcbiAgICB9XG4gICAgaW5DaGVjaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNDaGVjaygpO1xuICAgIH1cbiAgICBpc0NoZWNrbWF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNDaGVjaygpICYmIHRoaXMuX21vdmVzKCkubGVuZ3RoID09PSAwO1xuICAgIH1cbiAgICBpc1N0YWxlbWF0ZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzQ2hlY2soKSAmJiB0aGlzLl9tb3ZlcygpLmxlbmd0aCA9PT0gMDtcbiAgICB9XG4gICAgaXNJbnN1ZmZpY2llbnRNYXRlcmlhbCgpIHtcbiAgICAgICAgLypcbiAgICAgICAgICogay5iLiB2cyBrLmIuIChvZiBvcHBvc2l0ZSBjb2xvcnMpIHdpdGggbWF0ZSBpbiAxOlxuICAgICAgICAgKiA4LzgvOC84LzFiNi84L0IxazUvSzcgYiAtIC0gMCAxXG4gICAgICAgICAqXG4gICAgICAgICAqIGsuYi4gdnMgay5uLiB3aXRoIG1hdGUgaW4gMTpcbiAgICAgICAgICogOC84LzgvOC8xbjYvOC9CNy9LMWs1IGIgLSAtIDIgMVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgcGllY2VzID0ge1xuICAgICAgICAgICAgYjogMCxcbiAgICAgICAgICAgIG46IDAsXG4gICAgICAgICAgICByOiAwLFxuICAgICAgICAgICAgcTogMCxcbiAgICAgICAgICAgIGs6IDAsXG4gICAgICAgICAgICBwOiAwLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBiaXNob3BzID0gW107XG4gICAgICAgIGxldCBudW1QaWVjZXMgPSAwO1xuICAgICAgICBsZXQgc3F1YXJlQ29sb3IgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gT3g4OC5hODsgaSA8PSBPeDg4LmgxOyBpKyspIHtcbiAgICAgICAgICAgIHNxdWFyZUNvbG9yID0gKHNxdWFyZUNvbG9yICsgMSkgJSAyO1xuICAgICAgICAgICAgaWYgKGkgJiAweDg4KSB7XG4gICAgICAgICAgICAgICAgaSArPSA3O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGllY2UgPSB0aGlzLl9ib2FyZFtpXTtcbiAgICAgICAgICAgIGlmIChwaWVjZSkge1xuICAgICAgICAgICAgICAgIHBpZWNlc1twaWVjZS50eXBlXSA9IHBpZWNlLnR5cGUgaW4gcGllY2VzID8gcGllY2VzW3BpZWNlLnR5cGVdICsgMSA6IDE7XG4gICAgICAgICAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IEJJU0hPUCkge1xuICAgICAgICAgICAgICAgICAgICBiaXNob3BzLnB1c2goc3F1YXJlQ29sb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBudW1QaWVjZXMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBrIHZzLiBrXG4gICAgICAgIGlmIChudW1QaWVjZXMgPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAvLyBrIHZzLiBrbiAuLi4uIG9yIC4uLi4gayB2cy4ga2JcbiAgICAgICAgbnVtUGllY2VzID09PSAzICYmXG4gICAgICAgICAgICAocGllY2VzW0JJU0hPUF0gPT09IDEgfHwgcGllY2VzW0tOSUdIVF0gPT09IDEpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChudW1QaWVjZXMgPT09IHBpZWNlc1tCSVNIT1BdICsgMikge1xuICAgICAgICAgICAgLy8ga2IgdnMuIGtiIHdoZXJlIGFueSBudW1iZXIgb2YgYmlzaG9wcyBhcmUgYWxsIG9uIHRoZSBzYW1lIGNvbG9yXG4gICAgICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgICAgIGNvbnN0IGxlbiA9IGJpc2hvcHMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHN1bSArPSBiaXNob3BzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN1bSA9PT0gMCB8fCBzdW0gPT09IGxlbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgX2dldFJlcGV0aXRpb25Db3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uQ291bnRzW3RoaXMuZmVuKCldO1xuICAgIH1cbiAgICBpc1RocmVlZm9sZFJlcGV0aXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRSZXBldGl0aW9uQ291bnQoKSA+PSAzO1xuICAgIH1cbiAgICBpc0RyYXcoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5faGFsZk1vdmVzID49IDEwMCB8fCAvLyA1MCBtb3ZlcyBwZXIgc2lkZSA9IDEwMCBoYWxmIG1vdmVzXG4gICAgICAgICAgICB0aGlzLmlzU3RhbGVtYXRlKCkgfHxcbiAgICAgICAgICAgIHRoaXMuaXNJbnN1ZmZpY2llbnRNYXRlcmlhbCgpIHx8XG4gICAgICAgICAgICB0aGlzLmlzVGhyZWVmb2xkUmVwZXRpdGlvbigpKTtcbiAgICB9XG4gICAgaXNHYW1lT3ZlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNDaGVja21hdGUoKSB8fCB0aGlzLmlzU3RhbGVtYXRlKCkgfHwgdGhpcy5pc0RyYXcoKTtcbiAgICB9XG4gICAgbW92ZXMoeyB2ZXJib3NlID0gZmFsc2UsIHNxdWFyZSA9IHVuZGVmaW5lZCwgcGllY2UgPSB1bmRlZmluZWQsIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBtb3ZlcyA9IHRoaXMuX21vdmVzKHsgc3F1YXJlLCBwaWVjZSB9KTtcbiAgICAgICAgaWYgKHZlcmJvc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBtb3Zlcy5tYXAoKG1vdmUpID0+IHRoaXMuX21ha2VQcmV0dHkobW92ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1vdmVzLm1hcCgobW92ZSkgPT4gdGhpcy5fbW92ZVRvU2FuKG1vdmUsIG1vdmVzKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX21vdmVzKHsgbGVnYWwgPSB0cnVlLCBwaWVjZSA9IHVuZGVmaW5lZCwgc3F1YXJlID0gdW5kZWZpbmVkLCB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgZm9yU3F1YXJlID0gc3F1YXJlID8gc3F1YXJlLnRvTG93ZXJDYXNlKCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGZvclBpZWNlID0gcGllY2U/LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG1vdmVzID0gW107XG4gICAgICAgIGNvbnN0IHVzID0gdGhpcy5fdHVybjtcbiAgICAgICAgY29uc3QgdGhlbSA9IHN3YXBDb2xvcih1cyk7XG4gICAgICAgIGxldCBmaXJzdFNxdWFyZSA9IE94ODguYTg7XG4gICAgICAgIGxldCBsYXN0U3F1YXJlID0gT3g4OC5oMTtcbiAgICAgICAgbGV0IHNpbmdsZVNxdWFyZSA9IGZhbHNlO1xuICAgICAgICAvLyBhcmUgd2UgZ2VuZXJhdGluZyBtb3ZlcyBmb3IgYSBzaW5nbGUgc3F1YXJlP1xuICAgICAgICBpZiAoZm9yU3F1YXJlKSB7XG4gICAgICAgICAgICAvLyBpbGxlZ2FsIHNxdWFyZSwgcmV0dXJuIGVtcHR5IG1vdmVzXG4gICAgICAgICAgICBpZiAoIShmb3JTcXVhcmUgaW4gT3g4OCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaXJzdFNxdWFyZSA9IGxhc3RTcXVhcmUgPSBPeDg4W2ZvclNxdWFyZV07XG4gICAgICAgICAgICAgICAgc2luZ2xlU3F1YXJlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBmcm9tID0gZmlyc3RTcXVhcmU7IGZyb20gPD0gbGFzdFNxdWFyZTsgZnJvbSsrKSB7XG4gICAgICAgICAgICAvLyBkaWQgd2UgcnVuIG9mZiB0aGUgZW5kIG9mIHRoZSBib2FyZFxuICAgICAgICAgICAgaWYgKGZyb20gJiAweDg4KSB7XG4gICAgICAgICAgICAgICAgZnJvbSArPSA3O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZW1wdHkgc3F1YXJlIG9yIG9wcG9uZW50LCBza2lwXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2JvYXJkW2Zyb21dIHx8IHRoaXMuX2JvYXJkW2Zyb21dLmNvbG9yID09PSB0aGVtKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuX2JvYXJkW2Zyb21dO1xuICAgICAgICAgICAgbGV0IHRvO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09IFBBV04pIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yUGllY2UgJiYgZm9yUGllY2UgIT09IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vIHNpbmdsZSBzcXVhcmUsIG5vbi1jYXB0dXJpbmdcbiAgICAgICAgICAgICAgICB0byA9IGZyb20gKyBQQVdOX09GRlNFVFNbdXNdWzBdO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fYm9hcmRbdG9dKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCBmcm9tLCB0bywgUEFXTik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvdWJsZSBzcXVhcmVcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBmcm9tICsgUEFXTl9PRkZTRVRTW3VzXVsxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNFQ09ORF9SQU5LW3VzXSA9PT0gcmFuayhmcm9tKSAmJiAhdGhpcy5fYm9hcmRbdG9dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgZnJvbSwgdG8sIFBBV04sIHVuZGVmaW5lZCwgQklUUy5CSUdfUEFXTik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcGF3biBjYXB0dXJlc1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAyOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gZnJvbSArIFBBV05fT0ZGU0VUU1t1c11bal07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0byAmIDB4ODgpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW3RvXT8uY29sb3IgPT09IHRoZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCBmcm9tLCB0bywgUEFXTiwgdGhpcy5fYm9hcmRbdG9dLnR5cGUsIEJJVFMuQ0FQVFVSRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodG8gPT09IHRoaXMuX2VwU3F1YXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgZnJvbSwgdG8sIFBBV04sIFBBV04sIEJJVFMuRVBfQ0FQVFVSRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yUGllY2UgJiYgZm9yUGllY2UgIT09IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBQSUVDRV9PRkZTRVRTW3R5cGVdLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IFBJRUNFX09GRlNFVFNbdHlwZV1bal07XG4gICAgICAgICAgICAgICAgICAgIHRvID0gZnJvbTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvICs9IG9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0byAmIDB4ODgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2JvYXJkW3RvXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCBmcm9tLCB0bywgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvd24gY29sb3IsIHN0b3AgbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFt0b10uY29sb3IgPT09IHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgZnJvbSwgdG8sIHR5cGUsIHRoaXMuX2JvYXJkW3RvXS50eXBlLCBCSVRTLkNBUFRVUkUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyogYnJlYWssIGlmIGtuaWdodCBvciBraW5nICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gS05JR0hUIHx8IHR5cGUgPT09IEtJTkcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogY2hlY2sgZm9yIGNhc3RsaW5nIGlmIHdlJ3JlOlxuICAgICAgICAgKiAgIGEpIGdlbmVyYXRpbmcgYWxsIG1vdmVzLCBvclxuICAgICAgICAgKiAgIGIpIGRvaW5nIHNpbmdsZSBzcXVhcmUgbW92ZSBnZW5lcmF0aW9uIG9uIHRoZSBraW5nJ3Mgc3F1YXJlXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoZm9yUGllY2UgPT09IHVuZGVmaW5lZCB8fCBmb3JQaWVjZSA9PT0gS0lORykge1xuICAgICAgICAgICAgaWYgKCFzaW5nbGVTcXVhcmUgfHwgbGFzdFNxdWFyZSA9PT0gdGhpcy5fa2luZ3NbdXNdKSB7XG4gICAgICAgICAgICAgICAgLy8ga2luZy1zaWRlIGNhc3RsaW5nXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW3VzXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nRnJvbSA9IHRoaXMuX2tpbmdzW3VzXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdUbyA9IGNhc3RsaW5nRnJvbSArIDI7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tICsgMV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9ib2FyZFtjYXN0bGluZ1RvXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2F0dGFja2VkKHRoZW0sIHRoaXMuX2tpbmdzW3VzXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9hdHRhY2tlZCh0aGVtLCBjYXN0bGluZ0Zyb20gKyAxKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2F0dGFja2VkKHRoZW0sIGNhc3RsaW5nVG8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRNb3ZlKG1vdmVzLCB1cywgdGhpcy5fa2luZ3NbdXNdLCBjYXN0bGluZ1RvLCBLSU5HLCB1bmRlZmluZWQsIEJJVFMuS1NJREVfQ0FTVExFKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBxdWVlbi1zaWRlIGNhc3RsaW5nXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Nhc3RsaW5nW3VzXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nRnJvbSA9IHRoaXMuX2tpbmdzW3VzXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdUbyA9IGNhc3RsaW5nRnJvbSAtIDI7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tIC0gMV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb20gLSAyXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbSAtIDNdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYXR0YWNrZWQodGhlbSwgdGhpcy5fa2luZ3NbdXNdKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2F0dGFja2VkKHRoZW0sIGNhc3RsaW5nRnJvbSAtIDEpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdUbykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCB0aGlzLl9raW5nc1t1c10sIGNhc3RsaW5nVG8sIEtJTkcsIHVuZGVmaW5lZCwgQklUUy5RU0lERV9DQVNUTEUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIHJldHVybiBhbGwgcHNldWRvLWxlZ2FsIG1vdmVzICh0aGlzIGluY2x1ZGVzIG1vdmVzIHRoYXQgYWxsb3cgdGhlIGtpbmdcbiAgICAgICAgICogdG8gYmUgY2FwdHVyZWQpXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIWxlZ2FsIHx8IHRoaXMuX2tpbmdzW3VzXSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBtb3ZlcztcbiAgICAgICAgfVxuICAgICAgICAvLyBmaWx0ZXIgb3V0IGlsbGVnYWwgbW92ZXNcbiAgICAgICAgY29uc3QgbGVnYWxNb3ZlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmVzW2ldKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5faXNLaW5nQXR0YWNrZWQodXMpKSB7XG4gICAgICAgICAgICAgICAgbGVnYWxNb3Zlcy5wdXNoKG1vdmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VuZG9Nb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxlZ2FsTW92ZXM7XG4gICAgfVxuICAgIG1vdmUobW92ZSwgeyBzdHJpY3QgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgLypcbiAgICAgICAgICogVGhlIG1vdmUgZnVuY3Rpb24gY2FuIGJlIGNhbGxlZCB3aXRoIGluIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICAgICAgICpcbiAgICAgICAgICogLm1vdmUoJ054YjcnKSAgICAgICA8LSBhcmd1bWVudCBpcyBhIGNhc2Utc2Vuc2l0aXZlIFNBTiBzdHJpbmdcbiAgICAgICAgICpcbiAgICAgICAgICogLm1vdmUoeyBmcm9tOiAnaDcnLCA8LSBhcmd1bWVudCBpcyBhIG1vdmUgb2JqZWN0XG4gICAgICAgICAqICAgICAgICAgdG8gOidoOCcsXG4gICAgICAgICAqICAgICAgICAgcHJvbW90aW9uOiAncScgfSlcbiAgICAgICAgICpcbiAgICAgICAgICpcbiAgICAgICAgICogQW4gb3B0aW9uYWwgc3RyaWN0IGFyZ3VtZW50IG1heSBiZSBzdXBwbGllZCB0byB0ZWxsIGNoZXNzLmpzIHRvXG4gICAgICAgICAqIHN0cmljdGx5IGZvbGxvdyB0aGUgU0FOIHNwZWNpZmljYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbW92ZU9iaiA9IG51bGw7XG4gICAgICAgIGlmICh0eXBlb2YgbW92ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG1vdmVPYmogPSB0aGlzLl9tb3ZlRnJvbVNhbihtb3ZlLCBzdHJpY3QpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtb3ZlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3QgbW92ZXMgPSB0aGlzLl9tb3ZlcygpO1xuICAgICAgICAgICAgLy8gY29udmVydCB0aGUgcHJldHR5IG1vdmUgb2JqZWN0IHRvIGFuIHVnbHkgbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChtb3ZlLmZyb20gPT09IGFsZ2VicmFpYyhtb3Zlc1tpXS5mcm9tKSAmJlxuICAgICAgICAgICAgICAgICAgICBtb3ZlLnRvID09PSBhbGdlYnJhaWMobW92ZXNbaV0udG8pICYmXG4gICAgICAgICAgICAgICAgICAgICghKCdwcm9tb3Rpb24nIGluIG1vdmVzW2ldKSB8fCBtb3ZlLnByb21vdGlvbiA9PT0gbW92ZXNbaV0ucHJvbW90aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBtb3ZlT2JqID0gbW92ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBmYWlsZWQgdG8gZmluZCBtb3ZlXG4gICAgICAgIGlmICghbW92ZU9iaikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtb3ZlOiAke21vdmV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbW92ZTogJHtKU09OLnN0cmluZ2lmeShtb3ZlKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBuZWVkIHRvIG1ha2UgYSBjb3B5IG9mIG1vdmUgYmVjYXVzZSB3ZSBjYW4ndCBnZW5lcmF0ZSBTQU4gYWZ0ZXIgdGhlIG1vdmVcbiAgICAgICAgICogaXMgbWFkZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgcHJldHR5TW92ZSA9IHRoaXMuX21ha2VQcmV0dHkobW92ZU9iaik7XG4gICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmVPYmopO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbkNvdW50c1twcmV0dHlNb3ZlLmFmdGVyXSsrO1xuICAgICAgICByZXR1cm4gcHJldHR5TW92ZTtcbiAgICB9XG4gICAgX3B1c2gobW92ZSkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnB1c2goe1xuICAgICAgICAgICAgbW92ZSxcbiAgICAgICAgICAgIGtpbmdzOiB7IGI6IHRoaXMuX2tpbmdzLmIsIHc6IHRoaXMuX2tpbmdzLncgfSxcbiAgICAgICAgICAgIHR1cm46IHRoaXMuX3R1cm4sXG4gICAgICAgICAgICBjYXN0bGluZzogeyBiOiB0aGlzLl9jYXN0bGluZy5iLCB3OiB0aGlzLl9jYXN0bGluZy53IH0sXG4gICAgICAgICAgICBlcFNxdWFyZTogdGhpcy5fZXBTcXVhcmUsXG4gICAgICAgICAgICBoYWxmTW92ZXM6IHRoaXMuX2hhbGZNb3ZlcyxcbiAgICAgICAgICAgIG1vdmVOdW1iZXI6IHRoaXMuX21vdmVOdW1iZXIsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfbWFrZU1vdmUobW92ZSkge1xuICAgICAgICBjb25zdCB1cyA9IHRoaXMuX3R1cm47XG4gICAgICAgIGNvbnN0IHRoZW0gPSBzd2FwQ29sb3IodXMpO1xuICAgICAgICB0aGlzLl9wdXNoKG1vdmUpO1xuICAgICAgICB0aGlzLl9ib2FyZFttb3ZlLnRvXSA9IHRoaXMuX2JvYXJkW21vdmUuZnJvbV07XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFttb3ZlLmZyb21dO1xuICAgICAgICAvLyBpZiBlcCBjYXB0dXJlLCByZW1vdmUgdGhlIGNhcHR1cmVkIHBhd25cbiAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl90dXJuID09PSBCTEFDSykge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFttb3ZlLnRvIC0gMTZdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW21vdmUudG8gKyAxNl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgcGF3biBwcm9tb3Rpb24sIHJlcGxhY2Ugd2l0aCBuZXcgcGllY2VcbiAgICAgICAgaWYgKG1vdmUucHJvbW90aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFttb3ZlLnRvXSA9IHsgdHlwZTogbW92ZS5wcm9tb3Rpb24sIGNvbG9yOiB1cyB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHdlIG1vdmVkIHRoZSBraW5nXG4gICAgICAgIGlmICh0aGlzLl9ib2FyZFttb3ZlLnRvXS50eXBlID09PSBLSU5HKSB7XG4gICAgICAgICAgICB0aGlzLl9raW5nc1t1c10gPSBtb3ZlLnRvO1xuICAgICAgICAgICAgLy8gaWYgd2UgY2FzdGxlZCwgbW92ZSB0aGUgcm9vayBuZXh0IHRvIHRoZSBraW5nXG4gICAgICAgICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdUbyA9IG1vdmUudG8gLSAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nRnJvbSA9IG1vdmUudG8gKyAxO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvYXJkW2Nhc3RsaW5nVG9dID0gdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nVG8gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ0Zyb20gPSBtb3ZlLnRvIC0gMjtcbiAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZFtjYXN0bGluZ1RvXSA9IHRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0dXJuIG9mZiBjYXN0bGluZ1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmdbdXNdID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyB0dXJuIG9mZiBjYXN0bGluZyBpZiB3ZSBtb3ZlIGEgcm9va1xuICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbdXNdKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gUk9PS1NbdXNdLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUuZnJvbSA9PT0gUk9PS1NbdXNdW2ldLnNxdWFyZSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXN0bGluZ1t1c10gJiBST09LU1t1c11baV0uZmxhZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXN0bGluZ1t1c10gXj0gUk9PS1NbdXNdW2ldLmZsYWc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB0dXJuIG9mZiBjYXN0bGluZyBpZiB3ZSBjYXB0dXJlIGEgcm9va1xuICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbdGhlbV0pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBST09LU1t0aGVtXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChtb3ZlLnRvID09PSBST09LU1t0aGVtXVtpXS5zcXVhcmUgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmdbdGhlbV0gJiBST09LU1t0aGVtXVtpXS5mbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nW3RoZW1dIF49IFJPT0tTW3RoZW1dW2ldLmZsYWc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBiaWcgcGF3biBtb3ZlLCB1cGRhdGUgdGhlIGVuIHBhc3NhbnQgc3F1YXJlXG4gICAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5CSUdfUEFXTikge1xuICAgICAgICAgICAgaWYgKHVzID09PSBCTEFDSykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VwU3F1YXJlID0gbW92ZS50byAtIDE2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSBtb3ZlLnRvICsgMTY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IEVNUFRZO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlc2V0IHRoZSA1MCBtb3ZlIGNvdW50ZXIgaWYgYSBwYXduIGlzIG1vdmVkIG9yIGEgcGllY2UgaXMgY2FwdHVyZWRcbiAgICAgICAgaWYgKG1vdmUucGllY2UgPT09IFBBV04pIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbGZNb3ZlcyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW92ZS5mbGFncyAmIChCSVRTLkNBUFRVUkUgfCBCSVRTLkVQX0NBUFRVUkUpKSB7XG4gICAgICAgICAgICB0aGlzLl9oYWxmTW92ZXMgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faGFsZk1vdmVzKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzID09PSBCTEFDSykge1xuICAgICAgICAgICAgdGhpcy5fbW92ZU51bWJlcisrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3R1cm4gPSB0aGVtO1xuICAgIH1cbiAgICB1bmRvKCkge1xuICAgICAgICBjb25zdCBtb3ZlID0gdGhpcy5fdW5kb01vdmUoKTtcbiAgICAgICAgaWYgKG1vdmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXR0eU1vdmUgPSB0aGlzLl9tYWtlUHJldHR5KG1vdmUpO1xuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25Db3VudHNbcHJldHR5TW92ZS5hZnRlcl0tLTtcbiAgICAgICAgICAgIHJldHVybiBwcmV0dHlNb3ZlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBfdW5kb01vdmUoKSB7XG4gICAgICAgIGNvbnN0IG9sZCA9IHRoaXMuX2hpc3RvcnkucG9wKCk7XG4gICAgICAgIGlmIChvbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW92ZSA9IG9sZC5tb3ZlO1xuICAgICAgICB0aGlzLl9raW5ncyA9IG9sZC5raW5ncztcbiAgICAgICAgdGhpcy5fdHVybiA9IG9sZC50dXJuO1xuICAgICAgICB0aGlzLl9jYXN0bGluZyA9IG9sZC5jYXN0bGluZztcbiAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSBvbGQuZXBTcXVhcmU7XG4gICAgICAgIHRoaXMuX2hhbGZNb3ZlcyA9IG9sZC5oYWxmTW92ZXM7XG4gICAgICAgIHRoaXMuX21vdmVOdW1iZXIgPSBvbGQubW92ZU51bWJlcjtcbiAgICAgICAgY29uc3QgdXMgPSB0aGlzLl90dXJuO1xuICAgICAgICBjb25zdCB0aGVtID0gc3dhcENvbG9yKHVzKTtcbiAgICAgICAgdGhpcy5fYm9hcmRbbW92ZS5mcm9tXSA9IHRoaXMuX2JvYXJkW21vdmUudG9dO1xuICAgICAgICB0aGlzLl9ib2FyZFttb3ZlLmZyb21dLnR5cGUgPSBtb3ZlLnBpZWNlOyAvLyB0byB1bmRvIGFueSBwcm9tb3Rpb25zXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFttb3ZlLnRvXTtcbiAgICAgICAgaWYgKG1vdmUuY2FwdHVyZWQpIHtcbiAgICAgICAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICAgICAgICAgICAgLy8gZW4gcGFzc2FudCBjYXB0dXJlXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICAgICAgICAgIGlmICh1cyA9PT0gQkxBQ0spIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBtb3ZlLnRvIC0gMTY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IG1vdmUudG8gKyAxNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fYm9hcmRbaW5kZXhdID0geyB0eXBlOiBQQVdOLCBjb2xvcjogdGhlbSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmVndWxhciBjYXB0dXJlXG4gICAgICAgICAgICAgICAgdGhpcy5fYm9hcmRbbW92ZS50b10gPSB7IHR5cGU6IG1vdmUuY2FwdHVyZWQsIGNvbG9yOiB0aGVtIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5LU0lERV9DQVNUTEUgfCBCSVRTLlFTSURFX0NBU1RMRSkpIHtcbiAgICAgICAgICAgIGxldCBjYXN0bGluZ1RvLCBjYXN0bGluZ0Zyb207XG4gICAgICAgICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICAgICAgY2FzdGxpbmdUbyA9IG1vdmUudG8gKyAxO1xuICAgICAgICAgICAgICAgIGNhc3RsaW5nRnJvbSA9IG1vdmUudG8gLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FzdGxpbmdUbyA9IG1vdmUudG8gLSAyO1xuICAgICAgICAgICAgICAgIGNhc3RsaW5nRnJvbSA9IG1vdmUudG8gKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbY2FzdGxpbmdUb10gPSB0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb21dO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vdmU7XG4gICAgfVxuICAgIHBnbih7IG5ld2xpbmUgPSAnXFxuJywgbWF4V2lkdGggPSAwLCB9ID0ge30pIHtcbiAgICAgICAgLypcbiAgICAgICAgICogdXNpbmcgdGhlIHNwZWNpZmljYXRpb24gZnJvbSBodHRwOi8vd3d3LmNoZXNzY2x1Yi5jb20vaGVscC9QR04tc3BlY1xuICAgICAgICAgKiBleGFtcGxlIGZvciBodG1sIHVzYWdlOiAucGduKHsgbWF4X3dpZHRoOiA3MiwgbmV3bGluZV9jaGFyOiBcIjxiciAvPlwiIH0pXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGhlYWRlckV4aXN0cyA9IGZhbHNlO1xuICAgICAgICAvKiBhZGQgdGhlIFBHTiBoZWFkZXIgaW5mb3JtYXRpb24gKi9cbiAgICAgICAgZm9yIChjb25zdCBpIGluIHRoaXMuX2hlYWRlcikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRPRE86IG9yZGVyIG9mIGVudW1lcmF0ZWQgcHJvcGVydGllcyBpbiBoZWFkZXIgb2JqZWN0IGlzIG5vdFxuICAgICAgICAgICAgICogZ3VhcmFudGVlZCwgc2VlIEVDTUEtMjYyIHNwZWMgKHNlY3Rpb24gMTIuNi40KVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXN1bHQucHVzaCgnWycgKyBpICsgJyBcIicgKyB0aGlzLl9oZWFkZXJbaV0gKyAnXCJdJyArIG5ld2xpbmUpO1xuICAgICAgICAgICAgaGVhZGVyRXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGVhZGVyRXhpc3RzICYmIHRoaXMuX2hpc3RvcnkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXdsaW5lKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcHBlbmRDb21tZW50ID0gKG1vdmVTdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLl9jb21tZW50c1t0aGlzLmZlbigpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxpbWl0ZXIgPSBtb3ZlU3RyaW5nLmxlbmd0aCA+IDAgPyAnICcgOiAnJztcbiAgICAgICAgICAgICAgICBtb3ZlU3RyaW5nID0gYCR7bW92ZVN0cmluZ30ke2RlbGltaXRlcn17JHtjb21tZW50fX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1vdmVTdHJpbmc7XG4gICAgICAgIH07XG4gICAgICAgIC8vIHBvcCBhbGwgb2YgaGlzdG9yeSBvbnRvIHJldmVyc2VkX2hpc3RvcnlcbiAgICAgICAgY29uc3QgcmV2ZXJzZWRIaXN0b3J5ID0gW107XG4gICAgICAgIHdoaWxlICh0aGlzLl9oaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldmVyc2VkSGlzdG9yeS5wdXNoKHRoaXMuX3VuZG9Nb3ZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vdmVzID0gW107XG4gICAgICAgIGxldCBtb3ZlU3RyaW5nID0gJyc7XG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZSBvZiBhIGNvbW1lbnRlZCBzdGFydGluZyBwb3NpdGlvbiB3aXRoIG5vIG1vdmVzXG4gICAgICAgIGlmIChyZXZlcnNlZEhpc3RvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKGFwcGVuZENvbW1lbnQoJycpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBidWlsZCB0aGUgbGlzdCBvZiBtb3Zlcy4gIGEgbW92ZV9zdHJpbmcgbG9va3MgbGlrZTogXCIzLiBlMyBlNlwiXG4gICAgICAgIHdoaWxlIChyZXZlcnNlZEhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbW92ZVN0cmluZyA9IGFwcGVuZENvbW1lbnQobW92ZVN0cmluZyk7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gcmV2ZXJzZWRIaXN0b3J5LnBvcCgpO1xuICAgICAgICAgICAgLy8gbWFrZSBUeXBlU2NyaXB0IHN0b3AgY29tcGxhaW5pbmcgYWJvdXQgbW92ZSBiZWluZyB1bmRlZmluZWRcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlIHBvc2l0aW9uIHN0YXJ0ZWQgd2l0aCBibGFjayB0byBtb3ZlLCBzdGFydCBQR04gd2l0aCAjLiAuLi5cbiAgICAgICAgICAgIGlmICghdGhpcy5faGlzdG9yeS5sZW5ndGggJiYgbW92ZS5jb2xvciA9PT0gJ2InKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlZml4ID0gYCR7dGhpcy5fbW92ZU51bWJlcn0uIC4uLmA7XG4gICAgICAgICAgICAgICAgLy8gaXMgdGhlcmUgYSBjb21tZW50IHByZWNlZGluZyB0aGUgZmlyc3QgbW92ZT9cbiAgICAgICAgICAgICAgICBtb3ZlU3RyaW5nID0gbW92ZVN0cmluZyA/IGAke21vdmVTdHJpbmd9ICR7cHJlZml4fWAgOiBwcmVmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtb3ZlLmNvbG9yID09PSAndycpIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSB0aGUgcHJldmlvdXMgZ2VuZXJhdGVkIG1vdmVfc3RyaW5nIGlmIHdlIGhhdmUgb25lXG4gICAgICAgICAgICAgICAgaWYgKG1vdmVTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVzLnB1c2gobW92ZVN0cmluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vdmVTdHJpbmcgPSB0aGlzLl9tb3ZlTnVtYmVyICsgJy4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW92ZVN0cmluZyA9XG4gICAgICAgICAgICAgICAgbW92ZVN0cmluZyArICcgJyArIHRoaXMuX21vdmVUb1Nhbihtb3ZlLCB0aGlzLl9tb3Zlcyh7IGxlZ2FsOiB0cnVlIH0pKTtcbiAgICAgICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGFyZSB0aGVyZSBhbnkgb3RoZXIgbGVmdG92ZXIgbW92ZXM/XG4gICAgICAgIGlmIChtb3ZlU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgbW92ZXMucHVzaChhcHBlbmRDb21tZW50KG1vdmVTdHJpbmcpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpcyB0aGVyZSBhIHJlc3VsdD9cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9oZWFkZXIuUmVzdWx0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbW92ZXMucHVzaCh0aGlzLl9oZWFkZXIuUmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBoaXN0b3J5IHNob3VsZCBiZSBiYWNrIHRvIHdoYXQgaXQgd2FzIGJlZm9yZSB3ZSBzdGFydGVkIGdlbmVyYXRpbmcgUEdOLFxuICAgICAgICAgKiBzbyBqb2luIHRvZ2V0aGVyIG1vdmVzXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWF4V2lkdGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuam9pbignJykgKyBtb3Zlcy5qb2luKCcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETyAoamFoKTogaHVoP1xuICAgICAgICBjb25zdCBzdHJpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucG9wKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIC8vIE5COiB0aGlzIGRvZXMgbm90IHByZXNlcnZlIGNvbW1lbnQgd2hpdGVzcGFjZS5cbiAgICAgICAgY29uc3Qgd3JhcENvbW1lbnQgPSBmdW5jdGlvbiAod2lkdGgsIG1vdmUpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgbW92ZS5zcGxpdCgnICcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHdpZHRoICsgdG9rZW4ubGVuZ3RoID4gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHN0cmlwKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSk7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIHdpZHRoICs9IHRva2VuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgnICcpO1xuICAgICAgICAgICAgICAgIHdpZHRoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RyaXAoKSkge1xuICAgICAgICAgICAgICAgIHdpZHRoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgICAgIH07XG4gICAgICAgIC8vIHdyYXAgdGhlIFBHTiBvdXRwdXQgYXQgbWF4X3dpZHRoXG4gICAgICAgIGxldCBjdXJyZW50V2lkdGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFdpZHRoICsgbW92ZXNbaV0ubGVuZ3RoID4gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZXNbaV0uaW5jbHVkZXMoJ3snKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50V2lkdGggPSB3cmFwQ29tbWVudChjdXJyZW50V2lkdGgsIG1vdmVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgbW92ZSB3aWxsIHB1c2ggcGFzdCBtYXhfd2lkdGhcbiAgICAgICAgICAgIGlmIChjdXJyZW50V2lkdGggKyBtb3Zlc1tpXS5sZW5ndGggPiBtYXhXaWR0aCAmJiBpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgZW5kIHRoZSBsaW5lIHdpdGggd2hpdGVzcGFjZVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXdsaW5lKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50V2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCcgJyk7XG4gICAgICAgICAgICAgICAgY3VycmVudFdpZHRoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQucHVzaChtb3Zlc1tpXSk7XG4gICAgICAgICAgICBjdXJyZW50V2lkdGggKz0gbW92ZXNbaV0ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfVxuICAgIGhlYWRlciguLi5hcmdzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzW2ldID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYXJnc1tpICsgMV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyW2FyZ3NbaV1dID0gYXJnc1tpICsgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRlcjtcbiAgICB9XG4gICAgbG9hZFBnbihwZ24sIHsgc3RyaWN0ID0gZmFsc2UsIG5ld2xpbmVDaGFyID0gJ1xccj9cXG4nLCB9ID0ge30pIHtcbiAgICAgICAgZnVuY3Rpb24gbWFzayhzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxcXC9nLCAnXFxcXCcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlUGduSGVhZGVyKGhlYWRlcikge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyT2JqID0ge307XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gaGVhZGVyLnNwbGl0KG5ldyBSZWdFeHAobWFzayhuZXdsaW5lQ2hhcikpKTtcbiAgICAgICAgICAgIGxldCBrZXkgPSAnJztcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZWFkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSAvXlxccypcXFtcXHMqKFtBLVphLXpdKylcXHMqXCIoLiopXCJcXHMqXFxdXFxzKiQvO1xuICAgICAgICAgICAgICAgIGtleSA9IGhlYWRlcnNbaV0ucmVwbGFjZShyZWdleCwgJyQxJyk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBoZWFkZXJzW2ldLnJlcGxhY2UocmVnZXgsICckMicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyT2JqW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyT2JqO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN0cmlwIHdoaXRlc3BhY2UgZnJvbSBoZWFkL3RhaWwgb2YgUEdOIGJsb2NrXG4gICAgICAgIHBnbiA9IHBnbi50cmltKCk7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFJlZ0V4cCB0byBzcGxpdCBoZWFkZXIuIFRha2VzIGFkdmFudGFnZSBvZiB0aGUgZmFjdCB0aGF0IGhlYWRlciBhbmQgbW92ZXRleHRcbiAgICAgICAgICogd2lsbCBhbHdheXMgaGF2ZSBhIGJsYW5rIGxpbmUgYmV0d2VlbiB0aGVtIChpZSwgdHdvIG5ld2xpbmVfY2hhcidzKS4gSGFuZGxlc1xuICAgICAgICAgKiBjYXNlIHdoZXJlIG1vdmV0ZXh0IGlzIGVtcHR5IGJ5IG1hdGNoaW5nIG5ld2xpbmVDaGFyIHVudGlsIGVuZCBvZiBzdHJpbmcgaXNcbiAgICAgICAgICogbWF0Y2hlZCAtIGVmZmVjdGl2ZWx5IHRyaW1taW5nIGZyb20gdGhlIGVuZCBleHRyYSBuZXdsaW5lQ2hhci5cbiAgICAgICAgICpcbiAgICAgICAgICogV2l0aCBkZWZhdWx0IG5ld2xpbmVfY2hhciwgd2lsbCBlcXVhbDpcbiAgICAgICAgICogL14oXFxbKCg/Olxccj9cXG4pfC4pKlxcXSkoKD86XFxzKlxccj9cXG4pezJ9fCg/OlxccypcXHI/XFxuKSokKS9cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGhlYWRlclJlZ2V4ID0gbmV3IFJlZ0V4cCgnXihcXFxcWygoPzonICtcbiAgICAgICAgICAgIG1hc2sobmV3bGluZUNoYXIpICtcbiAgICAgICAgICAgICcpfC4pKlxcXFxdKScgK1xuICAgICAgICAgICAgJygoPzpcXFxccyonICtcbiAgICAgICAgICAgIG1hc2sobmV3bGluZUNoYXIpICtcbiAgICAgICAgICAgICcpezJ9fCg/OlxcXFxzKicgK1xuICAgICAgICAgICAgbWFzayhuZXdsaW5lQ2hhcikgK1xuICAgICAgICAgICAgJykqJCknKTtcbiAgICAgICAgLy8gSWYgbm8gaGVhZGVyIGdpdmVuLCBiZWdpbiB3aXRoIG1vdmVzLlxuICAgICAgICBjb25zdCBoZWFkZXJSZWdleFJlc3VsdHMgPSBoZWFkZXJSZWdleC5leGVjKHBnbik7XG4gICAgICAgIGNvbnN0IGhlYWRlclN0cmluZyA9IGhlYWRlclJlZ2V4UmVzdWx0c1xuICAgICAgICAgICAgPyBoZWFkZXJSZWdleFJlc3VsdHMubGVuZ3RoID49IDJcbiAgICAgICAgICAgICAgICA/IGhlYWRlclJlZ2V4UmVzdWx0c1sxXVxuICAgICAgICAgICAgICAgIDogJydcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgIC8vIFB1dCB0aGUgYm9hcmQgaW4gdGhlIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgLy8gcGFyc2UgUEdOIGhlYWRlclxuICAgICAgICBjb25zdCBoZWFkZXJzID0gcGFyc2VQZ25IZWFkZXIoaGVhZGVyU3RyaW5nKTtcbiAgICAgICAgbGV0IGZlbiA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgICAgICAvLyBjaGVjayB0byBzZWUgdXNlciBpcyBpbmNsdWRpbmcgZmVuIChwb3NzaWJseSB3aXRoIHdyb25nIHRhZyBjYXNlKVxuICAgICAgICAgICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSAnZmVuJykge1xuICAgICAgICAgICAgICAgIGZlbiA9IGhlYWRlcnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiB0aGUgcGVybWlzc2l2ZSBwYXJzZXIgc2hvdWxkIGF0dGVtcHQgdG8gbG9hZCBhIGZlbiB0YWcsIGV2ZW4gaWYgaXQncyB0aGVcbiAgICAgICAgICogd3JvbmcgY2FzZSBhbmQgZG9lc24ndCBpbmNsdWRlIGEgY29ycmVzcG9uZGluZyBbU2V0VXAgXCIxXCJdIHRhZ1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgICAgIGlmIChmZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQoZmVuLCB7IHByZXNlcnZlSGVhZGVyczogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBzdHJpY3QgcGFyc2VyIC0gbG9hZCB0aGUgc3RhcnRpbmcgcG9zaXRpb24gaW5kaWNhdGVkIGJ5IFtTZXR1cCAnMSddXG4gICAgICAgICAgICAgKiBhbmQgW0ZFTiBwb3NpdGlvbl1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGhlYWRlcnNbJ1NldFVwJ10gPT09ICcxJykge1xuICAgICAgICAgICAgICAgIGlmICghKCdGRU4nIGluIGhlYWRlcnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBQR046IEZFTiB0YWcgbXVzdCBiZSBzdXBwbGllZCB3aXRoIFNldFVwIHRhZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkb24ndCBjbGVhciB0aGUgaGVhZGVycyB3aGVuIGxvYWRpbmdcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQoaGVhZGVyc1snRkVOJ10sIHsgcHJlc2VydmVIZWFkZXJzOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIE5COiB0aGUgcmVnZXhlcyBiZWxvdyB0aGF0IGRlbGV0ZSBtb3ZlIG51bWJlcnMsIHJlY3Vyc2l2ZSBhbm5vdGF0aW9ucyxcbiAgICAgICAgICogYW5kIG51bWVyaWMgYW5ub3RhdGlvbiBnbHlwaHMgbWF5IGFsc28gbWF0Y2ggdGV4dCBpbiBjb21tZW50cy4gVG9cbiAgICAgICAgICogcHJldmVudCB0aGlzLCB3ZSB0cmFuc2Zvcm0gY29tbWVudHMgYnkgaGV4LWVuY29kaW5nIHRoZW0gaW4gcGxhY2UgYW5kXG4gICAgICAgICAqIGRlY29kaW5nIHRoZW0gYWdhaW4gYWZ0ZXIgdGhlIG90aGVyIHRva2VucyBoYXZlIGJlZW4gZGVsZXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogV2hpbGUgdGhlIHNwZWMgc3RhdGVzIHRoYXQgUEdOIGZpbGVzIHNob3VsZCBiZSBBU0NJSSBlbmNvZGVkLCB3ZSB1c2VcbiAgICAgICAgICoge2VuLGRlfWNvZGVVUklDb21wb25lbnQgaGVyZSB0byBzdXBwb3J0IGFyYml0cmFyeSBVVEY4IGFzIGEgY29udmVuaWVuY2VcbiAgICAgICAgICogZm9yIG1vZGVybiB1c2Vyc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdG9IZXgocykge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20ocylcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBlbmNvZGVVUkkgZG9lc24ndCB0cmFuc2Zvcm0gbW9zdCBBU0NJSSBjaGFyYWN0ZXJzLCBzbyB3ZSBoYW5kbGVcbiAgICAgICAgICAgICAgICAgKiB0aGVzZSBvdXJzZWx2ZXNcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApIDwgMTI4XG4gICAgICAgICAgICAgICAgICAgID8gYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgICAgICA6IGVuY29kZVVSSUNvbXBvbmVudChjKS5yZXBsYWNlKC8lL2csICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZnJvbUhleChzKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5sZW5ndGggPT0gMFxuICAgICAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgICAgICA6IGRlY29kZVVSSUNvbXBvbmVudCgnJScgKyAocy5tYXRjaCgvLnsxLDJ9L2cpIHx8IFtdKS5qb2luKCclJykpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVuY29kZUNvbW1lbnQgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgcyA9IHMucmVwbGFjZShuZXcgUmVnRXhwKG1hc2sobmV3bGluZUNoYXIpLCAnZycpLCAnICcpO1xuICAgICAgICAgICAgcmV0dXJuIGB7JHt0b0hleChzLnNsaWNlKDEsIHMubGVuZ3RoIC0gMSkpfX1gO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBkZWNvZGVDb21tZW50ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoJ3snKSAmJiBzLmVuZHNXaXRoKCd9JykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbUhleChzLnNsaWNlKDEsIHMubGVuZ3RoIC0gMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBkZWxldGUgaGVhZGVyIHRvIGdldCB0aGUgbW92ZXNcbiAgICAgICAgbGV0IG1zID0gcGduXG4gICAgICAgICAgICAucmVwbGFjZShoZWFkZXJTdHJpbmcsICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoXG4gICAgICAgIC8vIGVuY29kZSBjb21tZW50cyBzbyB0aGV5IGRvbid0IGdldCBkZWxldGVkIGJlbG93XG4gICAgICAgIG5ldyBSZWdFeHAoYCh7W159XSp9KSs/fDsoW14ke21hc2sobmV3bGluZUNoYXIpfV0qKWAsICdnJyksIGZ1bmN0aW9uIChfbWF0Y2gsIGJyYWNrZXQsIHNlbWljb2xvbikge1xuICAgICAgICAgICAgcmV0dXJuIGJyYWNrZXQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgID8gZW5jb2RlQ29tbWVudChicmFja2V0KVxuICAgICAgICAgICAgICAgIDogJyAnICsgZW5jb2RlQ29tbWVudChgeyR7c2VtaWNvbG9uLnNsaWNlKDEpfX1gKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAobWFzayhuZXdsaW5lQ2hhciksICdnJyksICcgJyk7XG4gICAgICAgIC8vIGRlbGV0ZSByZWN1cnNpdmUgYW5ub3RhdGlvbiB2YXJpYXRpb25zXG4gICAgICAgIGNvbnN0IHJhdlJlZ2V4ID0gLyhcXChbXigpXStcXCkpKz8vZztcbiAgICAgICAgd2hpbGUgKHJhdlJlZ2V4LnRlc3QobXMpKSB7XG4gICAgICAgICAgICBtcyA9IG1zLnJlcGxhY2UocmF2UmVnZXgsICcnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZWxldGUgbW92ZSBudW1iZXJzXG4gICAgICAgIG1zID0gbXMucmVwbGFjZSgvXFxkK1xcLihcXC5cXC4pPy9nLCAnJyk7XG4gICAgICAgIC8vIGRlbGV0ZSAuLi4gaW5kaWNhdGluZyBibGFjayB0byBtb3ZlXG4gICAgICAgIG1zID0gbXMucmVwbGFjZSgvXFwuXFwuXFwuL2csICcnKTtcbiAgICAgICAgLyogZGVsZXRlIG51bWVyaWMgYW5ub3RhdGlvbiBnbHlwaHMgKi9cbiAgICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXCRcXGQrL2csICcnKTtcbiAgICAgICAgLy8gdHJpbSBhbmQgZ2V0IGFycmF5IG9mIG1vdmVzXG4gICAgICAgIGxldCBtb3ZlcyA9IG1zLnRyaW0oKS5zcGxpdChuZXcgUmVnRXhwKC9cXHMrLykpO1xuICAgICAgICAvLyBkZWxldGUgZW1wdHkgZW50cmllc1xuICAgICAgICBtb3ZlcyA9IG1vdmVzLmZpbHRlcigobW92ZSkgPT4gbW92ZSAhPT0gJycpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIGZvciAobGV0IGhhbGZNb3ZlID0gMDsgaGFsZk1vdmUgPCBtb3Zlcy5sZW5ndGg7IGhhbGZNb3ZlKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBkZWNvZGVDb21tZW50KG1vdmVzW2hhbGZNb3ZlXSk7XG4gICAgICAgICAgICBpZiAoY29tbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29tbWVudHNbdGhpcy5mZW4oKV0gPSBjb21tZW50O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbW92ZSA9IHRoaXMuX21vdmVGcm9tU2FuKG1vdmVzW2hhbGZNb3ZlXSwgc3RyaWN0KTtcbiAgICAgICAgICAgIC8vIGludmFsaWQgbW92ZVxuICAgICAgICAgICAgaWYgKG1vdmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdhcyB0aGUgbW92ZSBhbiBlbmQgb2YgZ2FtZSBtYXJrZXJcbiAgICAgICAgICAgICAgICBpZiAoVEVSTUlOQVRJT05fTUFSS0VSUy5pbmRleE9mKG1vdmVzW2hhbGZNb3ZlXSkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBtb3Zlc1toYWxmTW92ZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbW92ZSBpbiBQR046ICR7bW92ZXNbaGFsZk1vdmVdfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBlbmQgb2YgZ2FtZSBtYXJrZXIgaWYgbWFraW5nIGEgdmFsaWQgbW92ZVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uQ291bnRzW3RoaXMuZmVuKCldKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogUGVyIHNlY3Rpb24gOC4yLjYgb2YgdGhlIFBHTiBzcGVjLCB0aGUgUmVzdWx0IHRhZyBwYWlyIG11c3QgbWF0Y2ggbWF0Y2hcbiAgICAgICAgICogdGhlIHRlcm1pbmF0aW9uIG1hcmtlci4gT25seSBkbyB0aGlzIHdoZW4gaGVhZGVycyBhcmUgcHJlc2VudCwgYnV0IHRoZVxuICAgICAgICAgKiByZXN1bHQgdGFnIGlzIG1pc3NpbmdcbiAgICAgICAgICovXG4gICAgICAgIGlmIChyZXN1bHQgJiYgT2JqZWN0LmtleXModGhpcy5faGVhZGVyKS5sZW5ndGggJiYgIXRoaXMuX2hlYWRlclsnUmVzdWx0J10pIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyKCdSZXN1bHQnLCByZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qXG4gICAgICogQ29udmVydCBhIG1vdmUgZnJvbSAweDg4IGNvb3JkaW5hdGVzIHRvIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvblxuICAgICAqIChTQU4pXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0cmljdCBVc2UgdGhlIHN0cmljdCBTQU4gcGFyc2VyLiBJdCB3aWxsIHRocm93IGVycm9yc1xuICAgICAqIG9uIG92ZXJseSBkaXNhbWJpZ3VhdGVkIG1vdmVzIChzZWUgYmVsb3cpOlxuICAgICAqXG4gICAgICogcjFicWtibnIvcHBwMnBwcC8ybjUvMUIxcFAzLzRQMy84L1BQUFAyUFAvUk5CUUsxTlIgYiBLUWtxIC0gMiA0XG4gICAgICogNC4gLi4uIE5nZTcgaXMgb3Zlcmx5IGRpc2FtYmlndWF0ZWQgYmVjYXVzZSB0aGUga25pZ2h0IG9uIGM2IGlzIHBpbm5lZFxuICAgICAqIDQuIC4uLiBOZTcgaXMgdGVjaG5pY2FsbHkgdGhlIHZhbGlkIFNBTlxuICAgICAqL1xuICAgIF9tb3ZlVG9TYW4obW92ZSwgbW92ZXMpIHtcbiAgICAgICAgbGV0IG91dHB1dCA9ICcnO1xuICAgICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSAnTy1PJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgIG91dHB1dCA9ICdPLU8tTyc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAobW92ZS5waWVjZSAhPT0gUEFXTikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc2FtYmlndWF0b3IgPSBnZXREaXNhbWJpZ3VhdG9yKG1vdmUsIG1vdmVzKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gbW92ZS5waWVjZS50b1VwcGVyQ2FzZSgpICsgZGlzYW1iaWd1YXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5waWVjZSA9PT0gUEFXTikge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYWxnZWJyYWljKG1vdmUuZnJvbSlbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dCArPSAneCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXRwdXQgKz0gYWxnZWJyYWljKG1vdmUudG8pO1xuICAgICAgICAgICAgaWYgKG1vdmUucHJvbW90aW9uKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc9JyArIG1vdmUucHJvbW90aW9uLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZSk7XG4gICAgICAgIGlmICh0aGlzLmlzQ2hlY2soKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDaGVja21hdGUoKSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnIyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJysnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VuZG9Nb3ZlKCk7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuICAgIC8vIGNvbnZlcnQgYSBtb3ZlIGZyb20gU3RhbmRhcmQgQWxnZWJyYWljIE5vdGF0aW9uIChTQU4pIHRvIDB4ODggY29vcmRpbmF0ZXNcbiAgICBfbW92ZUZyb21TYW4obW92ZSwgc3RyaWN0ID0gZmFsc2UpIHtcbiAgICAgICAgLy8gc3RyaXAgb2ZmIGFueSBtb3ZlIGRlY29yYXRpb25zOiBlLmcgTmYzKz8hIGJlY29tZXMgTmYzXG4gICAgICAgIGNvbnN0IGNsZWFuTW92ZSA9IHN0cmlwcGVkU2FuKG1vdmUpO1xuICAgICAgICBsZXQgcGllY2VUeXBlID0gaW5mZXJQaWVjZVR5cGUoY2xlYW5Nb3ZlKTtcbiAgICAgICAgbGV0IG1vdmVzID0gdGhpcy5fbW92ZXMoeyBsZWdhbDogdHJ1ZSwgcGllY2U6IHBpZWNlVHlwZSB9KTtcbiAgICAgICAgLy8gc3RyaWN0IHBhcnNlclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjbGVhbk1vdmUgPT09IHN0cmlwcGVkU2FuKHRoaXMuX21vdmVUb1Nhbihtb3Zlc1tpXSwgbW92ZXMpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb3Zlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB0aGUgc3RyaWN0IHBhcnNlciBmYWlsZWRcbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBpZWNlID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgbWF0Y2hlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGZyb20gPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCB0byA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHByb21vdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgLypcbiAgICAgICAgICogVGhlIGRlZmF1bHQgcGVybWlzc2l2ZSAobm9uLXN0cmljdCkgcGFyc2VyIGFsbG93cyB0aGUgdXNlciB0byBwYXJzZVxuICAgICAgICAgKiBub24tc3RhbmRhcmQgY2hlc3Mgbm90YXRpb25zLiBUaGlzIHBhcnNlciBpcyBvbmx5IHJ1biBhZnRlciB0aGUgc3RyaWN0XG4gICAgICAgICAqIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvbiAoU0FOKSBwYXJzZXIgaGFzIGZhaWxlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogV2hlbiBydW5uaW5nIHRoZSBwZXJtaXNzaXZlIHBhcnNlciwgd2UnbGwgcnVuIGEgcmVnZXggdG8gZ3JhYiB0aGUgcGllY2UsIHRoZVxuICAgICAgICAgKiB0by9mcm9tIHNxdWFyZSwgYW5kIGFuIG9wdGlvbmFsIHByb21vdGlvbiBwaWVjZS4gVGhpcyByZWdleCB3aWxsXG4gICAgICAgICAqIHBhcnNlIGNvbW1vbiBub24tc3RhbmRhcmQgbm90YXRpb24gbGlrZTogUGUyLWU0LCBSYzFjNCwgUWYzeGY3LFxuICAgICAgICAgKiBmN2Y4cSwgYjFjM1xuICAgICAgICAgKlxuICAgICAgICAgKiBOT1RFOiBTb21lIHBvc2l0aW9ucyBhbmQgbW92ZXMgbWF5IGJlIGFtYmlndW91cyB3aGVuIHVzaW5nIHRoZSBwZXJtaXNzaXZlXG4gICAgICAgICAqIHBhcnNlci4gRm9yIGV4YW1wbGUsIGluIHRoaXMgcG9zaXRpb246IDZrMS84LzgvQjcvOC84LzgvQk40SzEgdyAtIC0gMCAxLFxuICAgICAgICAgKiB0aGUgbW92ZSBiMWMzIG1heSBiZSBpbnRlcnByZXRlZCBhcyBOYzMgb3IgQjFjMyAoYSBkaXNhbWJpZ3VhdGVkIGJpc2hvcFxuICAgICAgICAgKiBtb3ZlKS4gSW4gdGhlc2UgY2FzZXMsIHRoZSBwZXJtaXNzaXZlIHBhcnNlciB3aWxsIGRlZmF1bHQgdG8gdGhlIG1vc3RcbiAgICAgICAgICogYmFzaWMgaW50ZXJwcmV0YXRpb24gKHdoaWNoIGlzIGIxYzMgcGFyc2luZyB0byBOYzMpLlxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG92ZXJseURpc2FtYmlndWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgbWF0Y2hlcyA9IGNsZWFuTW92ZS5tYXRjaCgvKFtwbmJycWtQTkJSUUtdKT8oW2EtaF1bMS04XSl4Py0/KFthLWhdWzEtOF0pKFtxcmJuUVJCTl0pPy8pO1xuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgcGllY2UgPSBtYXRjaGVzWzFdO1xuICAgICAgICAgICAgZnJvbSA9IG1hdGNoZXNbMl07XG4gICAgICAgICAgICB0byA9IG1hdGNoZXNbM107XG4gICAgICAgICAgICBwcm9tb3Rpb24gPSBtYXRjaGVzWzRdO1xuICAgICAgICAgICAgaWYgKGZyb20ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBvdmVybHlEaXNhbWJpZ3VhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUaGUgW2EtaF0/WzEtOF0/IHBvcnRpb24gb2YgdGhlIHJlZ2V4IGJlbG93IGhhbmRsZXMgbW92ZXMgdGhhdCBtYXkgYmVcbiAgICAgICAgICAgICAqIG92ZXJseSBkaXNhbWJpZ3VhdGVkIChlLmcuIE5nZTcgaXMgdW5uZWNlc3NhcnkgYW5kIG5vbi1zdGFuZGFyZCB3aGVuXG4gICAgICAgICAgICAgKiB0aGVyZSBpcyBvbmUgbGVnYWwga25pZ2h0IG1vdmUgdG8gZTcpLiBJbiB0aGlzIGNhc2UsIHRoZSB2YWx1ZSBvZlxuICAgICAgICAgICAgICogJ2Zyb20nIHZhcmlhYmxlIHdpbGwgYmUgYSByYW5rIG9yIGZpbGUsIG5vdCBhIHNxdWFyZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWF0Y2hlcyA9IGNsZWFuTW92ZS5tYXRjaCgvKFtwbmJycWtQTkJSUUtdKT8oW2EtaF0/WzEtOF0/KXg/LT8oW2EtaF1bMS04XSkoW3FyYm5RUkJOXSk/Lyk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIHBpZWNlID0gbWF0Y2hlc1sxXTtcbiAgICAgICAgICAgICAgICBmcm9tID0gbWF0Y2hlc1syXTtcbiAgICAgICAgICAgICAgICB0byA9IG1hdGNoZXNbM107XG4gICAgICAgICAgICAgICAgcHJvbW90aW9uID0gbWF0Y2hlc1s0XTtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBvdmVybHlEaXNhbWJpZ3VhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGllY2VUeXBlID0gaW5mZXJQaWVjZVR5cGUoY2xlYW5Nb3ZlKTtcbiAgICAgICAgbW92ZXMgPSB0aGlzLl9tb3Zlcyh7XG4gICAgICAgICAgICBsZWdhbDogdHJ1ZSxcbiAgICAgICAgICAgIHBpZWNlOiBwaWVjZSA/IHBpZWNlIDogcGllY2VUeXBlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCF0bykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIWZyb20pIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBmcm9tIHNxdWFyZSwgaXQgY291bGQgYmUganVzdCAneCcgbWlzc2luZyBmcm9tIGEgY2FwdHVyZVxuICAgICAgICAgICAgICAgIGlmIChjbGVhbk1vdmUgPT09XG4gICAgICAgICAgICAgICAgICAgIHN0cmlwcGVkU2FuKHRoaXMuX21vdmVUb1Nhbihtb3Zlc1tpXSwgbW92ZXMpKS5yZXBsYWNlKCd4JywgJycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb3Zlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGFuZC1jb21wYXJlIG1vdmUgcHJvcGVydGllcyB3aXRoIHRoZSByZXN1bHRzIGZyb20gb3VyIHBlcm1pc3NpdmUgcmVnZXhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCghcGllY2UgfHwgcGllY2UudG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5waWVjZSkgJiZcbiAgICAgICAgICAgICAgICBPeDg4W2Zyb21dID09IG1vdmVzW2ldLmZyb20gJiZcbiAgICAgICAgICAgICAgICBPeDg4W3RvXSA9PSBtb3Zlc1tpXS50byAmJlxuICAgICAgICAgICAgICAgICghcHJvbW90aW9uIHx8IHByb21vdGlvbi50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnByb21vdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW92ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChvdmVybHlEaXNhbWJpZ3VhdGVkKSB7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBTUEVDSUFMIENBU0U6IHdlIHBhcnNlZCBhIG1vdmUgc3RyaW5nIHRoYXQgbWF5IGhhdmUgYW4gdW5uZWVkZWRcbiAgICAgICAgICAgICAgICAgKiByYW5rL2ZpbGUgZGlzYW1iaWd1YXRvciAoZS5nLiBOZ2U3KS4gIFRoZSAnZnJvbScgdmFyaWFibGUgd2lsbFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IGFsZ2VicmFpYyhtb3Zlc1tpXS5mcm9tKTtcbiAgICAgICAgICAgICAgICBpZiAoKCFwaWVjZSB8fCBwaWVjZS50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnBpZWNlKSAmJlxuICAgICAgICAgICAgICAgICAgICBPeDg4W3RvXSA9PSBtb3Zlc1tpXS50byAmJlxuICAgICAgICAgICAgICAgICAgICAoZnJvbSA9PSBzcXVhcmVbMF0gfHwgZnJvbSA9PSBzcXVhcmVbMV0pICYmXG4gICAgICAgICAgICAgICAgICAgICghcHJvbW90aW9uIHx8IHByb21vdGlvbi50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnByb21vdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYXNjaWkoKSB7XG4gICAgICAgIGxldCBzID0gJyAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXFxuJztcbiAgICAgICAgZm9yIChsZXQgaSA9IE94ODguYTg7IGkgPD0gT3g4OC5oMTsgaSsrKSB7XG4gICAgICAgICAgICAvLyBkaXNwbGF5IHRoZSByYW5rXG4gICAgICAgICAgICBpZiAoZmlsZShpKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHMgKz0gJyAnICsgJzg3NjU0MzIxJ1tyYW5rKGkpXSArICcgfCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbaV0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwaWVjZSA9IHRoaXMuX2JvYXJkW2ldLnR5cGU7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLl9ib2FyZFtpXS5jb2xvcjtcbiAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2wgPSBjb2xvciA9PT0gV0hJVEUgPyBwaWVjZS50b1VwcGVyQ2FzZSgpIDogcGllY2UudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBzICs9ICcgJyArIHN5bWJvbCArICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMgKz0gJyAuICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGkgKyAxKSAmIDB4ODgpIHtcbiAgICAgICAgICAgICAgICBzICs9ICd8XFxuJztcbiAgICAgICAgICAgICAgICBpICs9IDg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcyArPSAnICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcXG4nO1xuICAgICAgICBzICs9ICcgICAgIGEgIGIgIGMgIGQgIGUgIGYgIGcgIGgnO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgcGVyZnQoZGVwdGgpIHtcbiAgICAgICAgY29uc3QgbW92ZXMgPSB0aGlzLl9tb3Zlcyh7IGxlZ2FsOiBmYWxzZSB9KTtcbiAgICAgICAgbGV0IG5vZGVzID0gMDtcbiAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLl90dXJuO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmVzW2ldKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5faXNLaW5nQXR0YWNrZWQoY29sb3IpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlcHRoIC0gMSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMgKz0gdGhpcy5wZXJmdChkZXB0aCAtIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91bmRvTW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG4gICAgLy8gcHJldHR5ID0gZXh0ZXJuYWwgbW92ZSBvYmplY3RcbiAgICBfbWFrZVByZXR0eSh1Z2x5TW92ZSkge1xuICAgICAgICBjb25zdCB7IGNvbG9yLCBwaWVjZSwgZnJvbSwgdG8sIGZsYWdzLCBjYXB0dXJlZCwgcHJvbW90aW9uIH0gPSB1Z2x5TW92ZTtcbiAgICAgICAgbGV0IHByZXR0eUZsYWdzID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgZmxhZyBpbiBCSVRTKSB7XG4gICAgICAgICAgICBpZiAoQklUU1tmbGFnXSAmIGZsYWdzKSB7XG4gICAgICAgICAgICAgICAgcHJldHR5RmxhZ3MgKz0gRkxBR1NbZmxhZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZnJvbUFsZ2VicmFpYyA9IGFsZ2VicmFpYyhmcm9tKTtcbiAgICAgICAgY29uc3QgdG9BbGdlYnJhaWMgPSBhbGdlYnJhaWModG8pO1xuICAgICAgICBjb25zdCBtb3ZlID0ge1xuICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICBwaWVjZSxcbiAgICAgICAgICAgIGZyb206IGZyb21BbGdlYnJhaWMsXG4gICAgICAgICAgICB0bzogdG9BbGdlYnJhaWMsXG4gICAgICAgICAgICBzYW46IHRoaXMuX21vdmVUb1Nhbih1Z2x5TW92ZSwgdGhpcy5fbW92ZXMoeyBsZWdhbDogdHJ1ZSB9KSksXG4gICAgICAgICAgICBmbGFnczogcHJldHR5RmxhZ3MsXG4gICAgICAgICAgICBsYW46IGZyb21BbGdlYnJhaWMgKyB0b0FsZ2VicmFpYyxcbiAgICAgICAgICAgIGJlZm9yZTogdGhpcy5mZW4oKSxcbiAgICAgICAgICAgIGFmdGVyOiAnJyxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgdGhlIEZFTiBmb3IgdGhlICdhZnRlcicga2V5XG4gICAgICAgIHRoaXMuX21ha2VNb3ZlKHVnbHlNb3ZlKTtcbiAgICAgICAgbW92ZS5hZnRlciA9IHRoaXMuZmVuKCk7XG4gICAgICAgIHRoaXMuX3VuZG9Nb3ZlKCk7XG4gICAgICAgIGlmIChjYXB0dXJlZCkge1xuICAgICAgICAgICAgbW92ZS5jYXB0dXJlZCA9IGNhcHR1cmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9tb3Rpb24pIHtcbiAgICAgICAgICAgIG1vdmUucHJvbW90aW9uID0gcHJvbW90aW9uO1xuICAgICAgICAgICAgbW92ZS5sYW4gKz0gcHJvbW90aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb3ZlO1xuICAgIH1cbiAgICB0dXJuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHVybjtcbiAgICB9XG4gICAgYm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IFtdO1xuICAgICAgICBsZXQgcm93ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSBPeDg4LmE4OyBpIDw9IE94ODguaDE7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW2ldID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByb3cucHVzaChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgc3F1YXJlOiBhbGdlYnJhaWMoaSksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuX2JvYXJkW2ldLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLl9ib2FyZFtpXS5jb2xvcixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoaSArIDEpICYgMHg4OCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgcm93ID0gW107XG4gICAgICAgICAgICAgICAgaSArPSA4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuICAgIHNxdWFyZUNvbG9yKHNxdWFyZSkge1xuICAgICAgICBpZiAoc3F1YXJlIGluIE94ODgpIHtcbiAgICAgICAgICAgIGNvbnN0IHNxID0gT3g4OFtzcXVhcmVdO1xuICAgICAgICAgICAgcmV0dXJuIChyYW5rKHNxKSArIGZpbGUoc3EpKSAlIDIgPT09IDAgPyAnbGlnaHQnIDogJ2RhcmsnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBoaXN0b3J5KHsgdmVyYm9zZSA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICBjb25zdCByZXZlcnNlZEhpc3RvcnkgPSBbXTtcbiAgICAgICAgY29uc3QgbW92ZUhpc3RvcnkgPSBbXTtcbiAgICAgICAgd2hpbGUgKHRoaXMuX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV2ZXJzZWRIaXN0b3J5LnB1c2godGhpcy5fdW5kb01vdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vdmUgPSByZXZlcnNlZEhpc3RvcnkucG9wKCk7XG4gICAgICAgICAgICBpZiAoIW1vdmUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2ZXJib3NlKSB7XG4gICAgICAgICAgICAgICAgbW92ZUhpc3RvcnkucHVzaCh0aGlzLl9tYWtlUHJldHR5KG1vdmUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vdmVIaXN0b3J5LnB1c2godGhpcy5fbW92ZVRvU2FuKG1vdmUsIHRoaXMuX21vdmVzKCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb3ZlSGlzdG9yeTtcbiAgICB9XG4gICAgX3BydW5lQ29tbWVudHMoKSB7XG4gICAgICAgIGNvbnN0IHJldmVyc2VkSGlzdG9yeSA9IFtdO1xuICAgICAgICBjb25zdCBjdXJyZW50Q29tbWVudHMgPSB7fTtcbiAgICAgICAgY29uc3QgY29weUNvbW1lbnQgPSAoZmVuKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmVuIGluIHRoaXMuX2NvbW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudENvbW1lbnRzW2Zlbl0gPSB0aGlzLl9jb21tZW50c1tmZW5dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB3aGlsZSAodGhpcy5faGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXZlcnNlZEhpc3RvcnkucHVzaCh0aGlzLl91bmRvTW92ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBjb3B5Q29tbWVudCh0aGlzLmZlbigpKTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vdmUgPSByZXZlcnNlZEhpc3RvcnkucG9wKCk7XG4gICAgICAgICAgICBpZiAoIW1vdmUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX21ha2VNb3ZlKG1vdmUpO1xuICAgICAgICAgICAgY29weUNvbW1lbnQodGhpcy5mZW4oKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29tbWVudHMgPSBjdXJyZW50Q29tbWVudHM7XG4gICAgfVxuICAgIGdldENvbW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb21tZW50c1t0aGlzLmZlbigpXTtcbiAgICB9XG4gICAgc2V0Q29tbWVudChjb21tZW50KSB7XG4gICAgICAgIHRoaXMuX2NvbW1lbnRzW3RoaXMuZmVuKCldID0gY29tbWVudC5yZXBsYWNlKCd7JywgJ1snKS5yZXBsYWNlKCd9JywgJ10nKTtcbiAgICB9XG4gICAgZGVsZXRlQ29tbWVudCgpIHtcbiAgICAgICAgY29uc3QgY29tbWVudCA9IHRoaXMuX2NvbW1lbnRzW3RoaXMuZmVuKCldO1xuICAgICAgICBkZWxldGUgdGhpcy5fY29tbWVudHNbdGhpcy5mZW4oKV07XG4gICAgICAgIHJldHVybiBjb21tZW50O1xuICAgIH1cbiAgICBnZXRDb21tZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJ1bmVDb21tZW50cygpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fY29tbWVudHMpLm1hcCgoZmVuKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyBmZW46IGZlbiwgY29tbWVudDogdGhpcy5fY29tbWVudHNbZmVuXSB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVsZXRlQ29tbWVudHMoKSB7XG4gICAgICAgIHRoaXMuX3BydW5lQ29tbWVudHMoKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2NvbW1lbnRzKS5tYXAoKGZlbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IHRoaXMuX2NvbW1lbnRzW2Zlbl07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY29tbWVudHNbZmVuXTtcbiAgICAgICAgICAgIHJldHVybiB7IGZlbjogZmVuLCBjb21tZW50OiBjb21tZW50IH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRDYXN0bGluZ1JpZ2h0cyhjb2xvciwgcmlnaHRzKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc2lkZSBvZiBbS0lORywgUVVFRU5dKSB7XG4gICAgICAgICAgICBpZiAocmlnaHRzW3NpZGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmlnaHRzW3NpZGVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nW2NvbG9yXSB8PSBTSURFU1tzaWRlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nW2NvbG9yXSAmPSB+U0lERVNbc2lkZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNhc3RsaW5nUmlnaHRzKCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZ2V0Q2FzdGxpbmdSaWdodHMoY29sb3IpO1xuICAgICAgICByZXR1cm4gKChyaWdodHNbS0lOR10gPT09IHVuZGVmaW5lZCB8fCByaWdodHNbS0lOR10gPT09IHJlc3VsdFtLSU5HXSkgJiZcbiAgICAgICAgICAgIChyaWdodHNbUVVFRU5dID09PSB1bmRlZmluZWQgfHwgcmlnaHRzW1FVRUVOXSA9PT0gcmVzdWx0W1FVRUVOXSkpO1xuICAgIH1cbiAgICBnZXRDYXN0bGluZ1JpZ2h0cyhjb2xvcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgW0tJTkddOiAodGhpcy5fY2FzdGxpbmdbY29sb3JdICYgU0lERVNbS0lOR10pICE9PSAwLFxuICAgICAgICAgICAgW1FVRUVOXTogKHRoaXMuX2Nhc3RsaW5nW2NvbG9yXSAmIFNJREVTW1FVRUVOXSkgIT09IDAsXG4gICAgICAgIH07XG4gICAgfVxuICAgIG1vdmVOdW1iZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3ZlTnVtYmVyO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZXNzLmpzLm1hcCIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAucGxheWVye1xyXG4gICAgY29sdW1uLWNvdW50OjI7XHJcbiAgICBoZWlnaHQ6NHZoO1xyXG59XHJcbi5wbGF5ZXIuYWJvdmV7XHJcbiAgICBwYWRkaW5nLXRvcDo0cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAtM3B4O1xyXG59XHJcbi5wbGF5ZXIuYmVsb3d7XHJcbiAgICBtYXJnaW4tdG9wOi0xcHg7XHJcbn1cclxuLnBsYXllci5iZWxvdyAuY2FwdHVyZXN7XHJcbiAgICBtYXJnaW4tdG9wOi02cHg7XHJcbn1cclxuLnBsYXllciAubmFtZXtcclxuICAgIGNsZWFyOmJvdGg7XHJcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcclxuICAgIHBhZGRpbmctcmlnaHQ6NHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6M3ZoO1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVze1xyXG4gICAgZmxvYXQ6bGVmdDtcclxuICAgIG1hcmdpbi10b3A6LTVweDtcclxufVxyXG4ucGxheWVyIC5zY29yZXtcclxuICAgIGZsb2F0OmxlZnQ7XHJcbiAgICBtYXJnaW4tbGVmdDo1cHg7XHJcbiAgICBtYXJnaW4tdG9wOjJweDtcclxuICAgIGZvbnQtc2l6ZToxMHB0O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIHN2Z3tcclxuICAgIHBvc2l0aW9uOnN0YXRpYztcclxuICAgIGhlaWdodDo0dmg7XHJcbiAgICB3aWR0aDo0dmg7XHJcbiAgICB0cmFuc2Zvcm06bm9uZTtcclxuICAgIG1hcmdpbi10b3A6MDtcclxuICAgIG1hcmdpbi1ib3R0b206LTExcHg7XHJcbn1cclxuLnBsYXllci53aGl0ZSAuY2FwdHVyZXMgc3BhbntcclxuICAgIHBhZGRpbmctYm90dG9tOiA3cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLnAgc3ZnOmZpcnN0LWNoaWxke1xyXG4gICAgcGFkZGluZy1sZWZ0OjRweDtcclxufVxyXG4ucGxheWVyIC5jYXB0dXJlcyAucCBzdmd7XHJcbiAgICBtYXJnaW4tbGVmdDotOHB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0Oi01cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLm57XHJcbiAgICBtYXJnaW4tbGVmdDogMnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxcHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLm4gc3Zne1xyXG4gICAgbWFyZ2luLWxlZnQ6IC02cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IC0zcHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLmIgc3Zne1xyXG4gICAgbWFyZ2luLWxlZnQ6IC03cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IC00cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLnIgc3Zne1xyXG4gICAgbWFyZ2luLWxlZnQ6IC02cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IC01cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLnEgc3Zne1xyXG4gICAgbWFyZ2luLWJvdHRvbTotMTBweDtcclxuICAgIG1hcmdpbi1sZWZ0OiAtMnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAwcHg7XHJcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVOYXZpZ2F0b3IvZ2FtZU5hdmlnYXRvci5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxjQUFjO0lBQ2QsVUFBVTtBQUNkO0FBQ0E7SUFDSSxlQUFlO0lBQ2YsbUJBQW1CO0FBQ3ZCO0FBQ0E7SUFDSSxlQUFlO0FBQ25CO0FBQ0E7SUFDSSxlQUFlO0FBQ25CO0FBQ0E7SUFDSSxVQUFVO0lBQ1YsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixlQUFlO0FBQ25CO0FBQ0E7SUFDSSxVQUFVO0lBQ1YsZUFBZTtBQUNuQjtBQUNBO0lBQ0ksVUFBVTtJQUNWLGVBQWU7SUFDZixjQUFjO0lBQ2QsY0FBYztBQUNsQjtBQUNBO0lBQ0ksZUFBZTtJQUNmLFVBQVU7SUFDVixTQUFTO0lBQ1QsY0FBYztJQUNkLFlBQVk7SUFDWixtQkFBbUI7QUFDdkI7QUFDQTtJQUNJLG1CQUFtQjtBQUN2QjtBQUNBO0lBQ0ksZ0JBQWdCO0FBQ3BCO0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxtQkFBbUI7SUFDbkIsaUJBQWlCO0lBQ2pCLGlCQUFpQjtBQUNyQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIucGxheWVye1xcclxcbiAgICBjb2x1bW4tY291bnQ6MjtcXHJcXG4gICAgaGVpZ2h0OjR2aDtcXHJcXG59XFxyXFxuLnBsYXllci5hYm92ZXtcXHJcXG4gICAgcGFkZGluZy10b3A6NHB4O1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAtM3B4O1xcclxcbn1cXHJcXG4ucGxheWVyLmJlbG93e1xcclxcbiAgICBtYXJnaW4tdG9wOi0xcHg7XFxyXFxufVxcclxcbi5wbGF5ZXIuYmVsb3cgLmNhcHR1cmVze1xcclxcbiAgICBtYXJnaW4tdG9wOi02cHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLm5hbWV7XFxyXFxuICAgIGNsZWFyOmJvdGg7XFxyXFxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xcclxcbiAgICBwYWRkaW5nLXJpZ2h0OjRweDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6M3ZoO1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlc3tcXHJcXG4gICAgZmxvYXQ6bGVmdDtcXHJcXG4gICAgbWFyZ2luLXRvcDotNXB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5zY29yZXtcXHJcXG4gICAgZmxvYXQ6bGVmdDtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6NXB4O1xcclxcbiAgICBtYXJnaW4tdG9wOjJweDtcXHJcXG4gICAgZm9udC1zaXplOjEwcHQ7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIHN2Z3tcXHJcXG4gICAgcG9zaXRpb246c3RhdGljO1xcclxcbiAgICBoZWlnaHQ6NHZoO1xcclxcbiAgICB3aWR0aDo0dmg7XFxyXFxuICAgIHRyYW5zZm9ybTpub25lO1xcclxcbiAgICBtYXJnaW4tdG9wOjA7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206LTExcHg7XFxyXFxufVxcclxcbi5wbGF5ZXIud2hpdGUgLmNhcHR1cmVzIHNwYW57XFxyXFxuICAgIHBhZGRpbmctYm90dG9tOiA3cHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIC5wIHN2ZzpmaXJzdC1jaGlsZHtcXHJcXG4gICAgcGFkZGluZy1sZWZ0OjRweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLnAgc3Zne1xcclxcbiAgICBtYXJnaW4tbGVmdDotOHB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6LTVweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLm57XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAycHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMXB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlcyAubiBzdmd7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAtNnB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IC0zcHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIC5iIHN2Z3tcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IC03cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogLTRweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLnIgc3Zne1xcclxcbiAgICBtYXJnaW4tbGVmdDogLTZweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAtNXB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlcyAucSBzdmd7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206LTEwcHg7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAtMnB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IDBweDtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBib2R5e3BhZGRpbmc6MDttYXJnaW46MDt9YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcGFnZXMvb3BlbmluZ3Mvb3BlbmluZ3MuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLEtBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQ1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCJib2R5e3BhZGRpbmc6MDttYXJnaW46MDt9XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vZ2FtZU5hdmlnYXRvci5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWVOYXZpZ2F0b3IuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL29wZW5pbmdzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vb3BlbmluZ3MuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJpbXBvcnQgQm9hcmRMYXllciBmcm9tIFwiLi9MYXllcnMvQm9hcmRMYXllclwiO1xyXG5pbXBvcnQgQ29yZHNMYXllciBmcm9tIFwiLi9MYXllcnMvQ29yZHNMYXllclwiO1xyXG5pbXBvcnQgUGllY2VMYXllciBmcm9tIFwiLi9MYXllcnMvUGllY2VMYXllclwiO1xyXG5pbXBvcnQgQXJyb3dMYXllciBmcm9tIFwiLi9MYXllcnMvQXJyb3dMYXllclwiO1xyXG5pbXBvcnQgTW91c2VFdmVudHMgZnJvbSBcIi4vTW91c2VFdmVudHNcIjtcclxuaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi9TaGFyZWRcIjtcclxuaW1wb3J0IFBpZWNlIGZyb20gXCIuL1BpZWNlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGVzc2JvYXJke1xyXG4gICAgc3ZnUm9vdDpTVkdTVkdFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBib2FyZExheWVyOkJvYXJkTGF5ZXI7XHJcbiAgICBwcml2YXRlIGNvcmRzTGF5ZXI6Q29yZHNMYXllcjtcclxuICAgIHByaXZhdGUgcGllY2VMYXllcjpQaWVjZUxheWVyO1xyXG4gICAgcHJpdmF0ZSBhcnJvd0xheWVyOkFycm93TGF5ZXI7XHJcbiAgICBwcml2YXRlIG1vdXNlRXZlbnRzOk1vdXNlRXZlbnRzXHJcbiAgICBwcml2YXRlIGlzUm90YXRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJvYXJkQ29udGFpbmVyOkhUTUxFbGVtZW50LCBmZW46c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3Quc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCA4MDAgODAwJyk7XHJcbiAgICAgICAgYm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zdmdSb290KTtcclxuXHJcbiAgICAgICAgdGhpcy5ib2FyZExheWVyID0gbmV3IEJvYXJkTGF5ZXIodGhpcy5zdmdSb290LCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuY29yZHNMYXllciA9IG5ldyBDb3Jkc0xheWVyKHRoaXMuc3ZnUm9vdCwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnBpZWNlTGF5ZXIgPSBuZXcgUGllY2VMYXllcih0aGlzLnN2Z1Jvb3QsIGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5hcnJvd0xheWVyID0gbmV3IEFycm93TGF5ZXIodGhpcy5zdmdSb290LCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMubW91c2VFdmVudHMgPSBuZXcgTW91c2VFdmVudHModGhpcy5zdmdSb290LCB0aGlzLmJvYXJkTGF5ZXIsIHRoaXMuYXJyb3dMYXllciwgdGhpcy5pc1JvdGF0ZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEZlbihmZW4sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHJvdGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gIXRoaXMuaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuY29yZHNMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMucGllY2VMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuYXJyb3dMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMubW91c2VFdmVudHMucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgIH1cclxuICAgIHNldEZlbihmZW46c3RyaW5nLCBjbGVhckZpcnN0OmJvb2xlYW4pe1xyXG4gICAgICAgIGlmIChjbGVhckZpcnN0KXtcclxuICAgICAgICAgICAgdGhpcy5waWVjZUxheWVyLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmZW4gIT09IFwiXCIpe1xyXG4gICAgICAgICAgICBpZiAoZmVuLnRvTG93ZXJDYXNlKCkgPT09IFwic3RhcnRcIilcclxuICAgICAgICAgICAgICAgIGZlbiA9IFNoYXJlZC5zdGFydEZFTjtcclxuICAgICAgICAgICAgZmVuID0gZmVuLnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi9cIikuam9pbihcIlwiKTtcclxuICAgICAgICAgICAgbGV0IHNxdWFyZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZW4ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZlbkNoYXIgPSBmZW5baV07XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVtbWVyaWNWYWx1ZSA9IHBhcnNlSW50KGZlbkNoYXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1tZXJpY1ZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3F1YXJlSW5kZXggKz0gbnVtbWVyaWNWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdGF0ZWRJbmRleCA9IHRoaXMuaXNSb3RhdGVkID8gNjMgLSBzcXVhcmVJbmRleCA6IHNxdWFyZUluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSBTaGFyZWQuZ2V0U3F1YXJlS2V5QnlJbmRleChyb3RhdGVkSW5kZXgsIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBpZWNlTGF5ZXIuYWRkUGllY2UoZmVuQ2hhciwga2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBzcXVhcmVJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0UGllY2Uoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGllY2VMYXllci5nZXRQaWVjZShzcXVhcmVLZXkpO1xyXG4gICAgfVxyXG4gICAgc2V0UGllY2VQb3NpdGlvbihwaWVjZTpQaWVjZSwgc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgcGllY2Uuc3F1YXJlS2V5ID0gc3F1YXJlS2V5O1xyXG4gICAgICAgIHRoaXMucGllY2VMYXllci5zZXRQb3NpdGlvbihwaWVjZSk7XHJcbiAgICB9XHJcbiAgICBhZGRQaWVjZShmZW5DaGFyOnN0cmluZywgc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGllY2VMYXllci5hZGRQaWVjZShmZW5DaGFyLCBzcXVhcmVLZXkpO1xyXG4gICAgfVxyXG4gICAgLy8gdW5kb1BpZWNlUmVtb3ZhbChwaWVjZTpQaWVjZSl7XHJcbiAgICAvLyAgICAgdGhpcy5waWVjZUxheWVyLnVuZG9QaWVjZVJlbW92YWwocGllY2UpO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gcHV0UGllY2VCYWNrV2l0aE5ld1Bvc2l0aW9uKHBpZWNlOlBpZWNlLCBzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgIC8vICAgICBwaWVjZS5zcXVhcmVLZXkgPSBzcXVhcmVLZXk7XHJcbiAgICAvLyAgICAgdGhpcy5waWVjZUxheWVyLnVuZG9QaWVjZVJlbW92YWwocGllY2UpO1xyXG4gICAgLy8gfVxyXG4gICAgcmVtb3ZlUGllY2VCeVNxdWFyZUtleShzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5waWVjZUxheWVyLnJlbW92ZVBpZWNlQnlTcXVhcmVLZXkoc3F1YXJlS2V5KTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFNvdXJjZShmcm9tOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5ib2FyZExheWVyLmhpZ2hsaWdodFNvdXJjZShmcm9tKTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFRhcmdldCh0bzpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5oaWdobGlnaHRUYXJnZXQodG8pO1xyXG4gICAgfVxyXG4gICAgY2xlYXJTb3VyY2VBbmRUYXJnZXRIaWdobGlnaHRzKCl7XHJcbiAgICAgICAgdGhpcy5ib2FyZExheWVyLmNsZWFyU291cmNlQW5kVGFyZ2V0SGlnaGxpZ2h0cygpO1xyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0U291cmNlQW5kVGFyZ2V0KGZyb206c3RyaW5nLCB0bzpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5oaWdobGlnaHRTb3VyY2VBbmRUYXJnZXQoZnJvbSwgdG8pO1xyXG4gICAgfVxyXG4gICAgcHV0T25Ub3AocGllY2U6UGllY2Upe1xyXG4gICAgICAgIHRoaXMucGllY2VMYXllci5wdXRPblRvcChwaWVjZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi4vU2hhcmVkXCI7XHJcblxyXG5pbnRlcmZhY2UgQXJyb3cge1xyXG4gICAgZnJvbTpzdHJpbmcsXHJcbiAgICB0bzpzdHJpbmdcclxufVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnJvd0xheWVye1xyXG4gICAgcHJpdmF0ZSBzdmdSb290OlNWR1NWR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzdHJva2VXaWR0aCA9IDIwO1xyXG4gICAgcHJpdmF0ZSByaWdodENsaWNrZWRTcXVhcmVLZXk6c3RyaW5nfG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBpc1JvdGF0ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgY3VycmVudEFycm93czogQXJyb3dbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudCwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdCA9IHN2Z1Jvb3Q7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmRDaGlsZChncm91cCk7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGdyb3VwO1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJyb3dzLmZvckVhY2goYXJyb3cgPT57XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Fycm93KGFycm93LmZyb20sIGFycm93LnRvKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgb25SaWdodEJ1dHRvbkRvd24oc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgPSBzcXVhcmVLZXk7XHJcbiAgICB9XHJcbiAgICBvbkxlZnRCdXR0b25Eb3duKCl7XHJcbiAgICAgICAgdGhpcy5ncm91cC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFycm93cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgb25SaWdodEJ1dHRvblVwKHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSAmJiB0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSAhPT0gc3F1YXJlS2V5KXtcclxuICAgICAgICAgICAgdGhpcy5kcmF3QXJyb3codGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXksIHNxdWFyZUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkcmF3QXJyb3coZnJvbVNxdWFyZTpzdHJpbmcsIHRvU3F1YXJlOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJyb3dzLnB1c2goe2Zyb206ZnJvbVNxdWFyZSwgdG86dG9TcXVhcmV9KTtcclxuICAgICAgICBjb25zdCBwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwb2x5Z29uJyk7XHJcbiAgICAgICAgbGV0IHBvaW50MSA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDIgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQzID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50NCA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDUgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQ2ID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50NyA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG5cclxuICAgICAgICBsZXQgZnJvbSA9IHRoaXMuZ2V0UmVsYXRpdmVDZW50ZXIoZnJvbVNxdWFyZSk7XHJcbiAgICAgICAgbGV0IHRvID0gdGhpcy5nZXRSZWxhdGl2ZUNlbnRlcih0b1NxdWFyZSk7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHRvLnggLSBmcm9tLngsIDIpICsgTWF0aC5wb3codG8ueSAtZnJvbS55LCAyKSk7XHJcbiAgICAgICAgbGV0IHNob3J0ZW5EaXN0YW5jZSA9IDMwO1xyXG4gICAgICAgIGxldCBjZW50ZXIgPSB7IHg6IChmcm9tLnggKyB0by54KS8yLCB5OiAoZnJvbS55ICsgdG8ueSkvMiB9O1xyXG4gICAgICAgIGxldCB0cmlhbmdsZVNpZGVMZW5ndGggPSA0MDtcclxuICAgICAgICBsZXQgYSA9IHRyaWFuZ2xlU2lkZUxlbmd0aCAvIDI7XHJcbiAgICAgICAgbGV0IGMgPSB0cmlhbmdsZVNpZGVMZW5ndGg7XHJcbiAgICAgICAgbGV0IGhlaWdodE9mVHJpYW5nbGUgPSBNYXRoLnNxcnQoTWF0aC5wb3coYywgMikgLSBNYXRoLnBvdyhhLDIpKTtcclxuXHJcbiAgICAgICAgcG9pbnQxLnggPSBjZW50ZXIueCAtIChkaXN0YW5jZSAvIDIpICsgc2hvcnRlbkRpc3RhbmNlO1xyXG4gICAgICAgIHBvaW50MS55ID0gY2VudGVyLnkgLSB0aGlzLnN0cm9rZVdpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgcG9pbnQyLnggPSBwb2ludDEueDtcclxuICAgICAgICBwb2ludDIueSA9IHBvaW50MS55ICsgdGhpcy5zdHJva2VXaWR0aDtcclxuXHJcbiAgICAgICAgcG9pbnQzLnggPSBwb2ludDIueCArIGRpc3RhbmNlIC0gaGVpZ2h0T2ZUcmlhbmdsZSAtIHNob3J0ZW5EaXN0YW5jZTtcclxuICAgICAgICBwb2ludDMueSA9IHBvaW50Mi55O1xyXG5cclxuICAgICAgICBwb2ludDQueCA9IHBvaW50My54O1xyXG4gICAgICAgIHBvaW50NC55ID0gcG9pbnQzLnkgKyAoKHRyaWFuZ2xlU2lkZUxlbmd0aCAvIDIpIC0gKHRoaXMuc3Ryb2tlV2lkdGggLyAyKSk7XHJcblxyXG4gICAgICAgIHBvaW50NS54ID0gcG9pbnQ0LnggKyBoZWlnaHRPZlRyaWFuZ2xlO1xyXG4gICAgICAgIHBvaW50NS55ID0gY2VudGVyLnk7XHJcblxyXG4gICAgICAgIHBvaW50Ni54ID0gcG9pbnQ0Lng7XHJcbiAgICAgICAgcG9pbnQ2LnkgPSBwb2ludDQueSAtIHRyaWFuZ2xlU2lkZUxlbmd0aDtcclxuXHJcbiAgICAgICAgcG9pbnQ3LnggPSBwb2ludDMueDtcclxuICAgICAgICBwb2ludDcueSA9IHBvaW50My55IC0gdGhpcy5zdHJva2VXaWR0aDtcclxuXHJcbiAgICAgICAgbGV0IGRlbHRhWCA9IHRvLnggLSBmcm9tLng7XHJcbiAgICAgICAgbGV0IGRlbHRhWSA9IHRvLnkgLSBmcm9tLnk7XHJcblxyXG4gICAgICAgIGxldCByYWRpYW4gPSBNYXRoLmF0YW4yKGRlbHRhWSwgZGVsdGFYKTtcclxuICAgICAgICBsZXQgZGVncmVlcyA9IHJhZGlhbiAqIDE4MCAvIE1hdGguUEk7XHJcblxyXG4gICAgICAgIHBvbHlnb24uc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGRlZ3JlZXMgKyBcIiBcIiArIGNlbnRlci54LnRvU3RyaW5nKCkgKyBcIiBcIiArIGNlbnRlci55LnRvU3RyaW5nKCkgKyBcIilcIik7XHJcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFycm93XCIpO1xyXG4gICAgICAgIHBvbHlnb24uc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInJnYmEoMjU1LCAxNzAsIDAsIDAuOClcIik7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDEpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQyKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50Myk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDQpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQ1KTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50Nik7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDcpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQocG9seWdvbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFJlbGF0aXZlQ2VudGVyKHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBjaGFyID0gc3F1YXJlS2V5WzBdO1xyXG4gICAgICAgIGxldCBkaWdpdCA9IHNxdWFyZUtleVsxXTtcclxuICAgICAgICBsZXQgeCA9IFNoYXJlZC5nZXRIb3Jpem9udGFsSW5kZXgoY2hhciwgdGhpcy5pc1JvdGF0ZWQpICogMTAwICsgNTA7XHJcbiAgICAgICAgbGV0IHkgPSBTaGFyZWQuZ2V0VmVydGljYWxJbmRleChkaWdpdCwgdGhpcy5pc1JvdGF0ZWQpICogMTAwICsgNTA7XHJcbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNWR1NxdWFyZSBmcm9tIFwiLi4vU3F1YXJlRmFjdG9yeVwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuLi9TaGFyZWRcIjtcclxuXHJcbmludGVyZmFjZSBIaWdobGlnaHR7XHJcbiAgICBzcXVhcmVLZXk6c3RyaW5nLFxyXG4gICAgdHlwZTpzdHJpbmc7XHJcbiAgICByZWN0OlNWR1JlY3RFbGVtZW50O1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXJkTGF5ZXJ7XHJcbiAgICBwcml2YXRlIHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudDtcclxuICAgIHByaXZhdGUgaXNSb3RhdGVkOmJvb2xlYW47XHJcbiAgICBwcml2YXRlIHNvdXJjZUhpZ2hsaWdodDpIaWdobGlnaHQ7XHJcbiAgICBwcml2YXRlIHRhcmdldEhpZ2hsaWdodDpIaWdobGlnaHQ7XHJcbiAgICBwcml2YXRlIHNvdXJjZVRhcmdldEdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzb3VyY2VDb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgNTEsIDAuMylcIjtcclxuICAgIHByaXZhdGUgdGFyZ2V0Q29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDUxLCAwLjQpXCI7XHJcbiAgICBwcml2YXRlIHJpZ2h0Q2xpY2tDb2xvciA9IFwicmdiKDIzNSwgOTcsIDgwLCAwLjgpXCI7XHJcbiAgICBwcml2YXRlIHJpZ2h0Q2xpY2tHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmlnaHRDbGlja3M6UmVjb3JkPHN0cmluZywgSGlnaGxpZ2h0fG51bGw+ID0ge307XHJcbiAgICBwcml2YXRlIHJpZ2h0Q2xpY2tlZFNxdWFyZUtleTpzdHJpbmd8bnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50LCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gc3ZnUm9vdDtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFwcGVuZENoaWxkKGdyb3VwKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbG9ycyA9IFtcImxcIiwgXCJkXCIsIFwibFwiLCBcImRcIiwgXCJsXCIsIFwiZFwiLCBcImxcIiwgXCJkXCJdO1xyXG5cclxuICAgICAgICBbMCwgMSwgMiwgMywgNCwgNSwgNiwgN10uZm9yRWFjaCh5ID0+e1xyXG4gICAgICAgICAgICBbMCwgMSwgMiwgMywgNCwgNSwgNiwgN10uZm9yRWFjaCgoeCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVCb2FyZFJlY3QoeCwgeSwgY29sb3JzW2luZGV4XSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29sb3JzID0gY29sb3JzLnJldmVyc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNvdXJjZVRhcmdldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFwcGVuZENoaWxkKHRoaXMuc291cmNlVGFyZ2V0R3JvdXApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc291cmNlSGlnaGxpZ2h0ID0ge3NxdWFyZUtleTogXCJhOFwiLCB0eXBlOiBcInNvdXJjZVwiLCByZWN0OiBTVkdTcXVhcmUuY3JlYXRlUmVjdCgwLDApfTtcclxuICAgICAgICB0aGlzLnRhcmdldEhpZ2hsaWdodCA9IHtzcXVhcmVLZXk6IFwiYTdcIiwgdHlwZTogXCJ0YXJnZXRcIiwgcmVjdDogU1ZHU3F1YXJlLmNyZWF0ZVJlY3QoMSwwKX07XHJcbiAgICAgICAgdGhpcy5zb3VyY2VIaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwidHJhbnNwYXJlbnRcIik7XHJcbiAgICAgICAgdGhpcy50YXJnZXRIaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwidHJhbnNwYXJlbnRcIik7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VUYXJnZXRHcm91cC5hcHBlbmRDaGlsZCh0aGlzLnNvdXJjZUhpZ2hsaWdodC5yZWN0KTtcclxuICAgICAgICB0aGlzLnNvdXJjZVRhcmdldEdyb3VwLmFwcGVuZENoaWxkKHRoaXMudGFyZ2V0SGlnaGxpZ2h0LnJlY3QpO1xyXG5cclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hcHBlbmRDaGlsZCh0aGlzLnJpZ2h0Q2xpY2tHcm91cCk7XHJcbiAgICB9XHJcbiAgICBvbkxlZnRCdXR0b25Eb3duKCl7XHJcbiAgICAgICAgdGhpcy5jbGVhckFsbEhpZ2hsaWdodHMoKTtcclxuICAgIH1cclxuICAgIG9uUmlnaHRCdXR0b25Eb3duKHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ID0gc3F1YXJlS2V5O1xyXG4gICAgfVxyXG4gICAgb25SaWdodEJ1dHRvblVwKHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSAmJiB0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSA9PT0gc3F1YXJlS2V5KXtcclxuICAgICAgICAgICAgbGV0IHJpZ2h0Q2xpY2tlZCA9IHRoaXMucmlnaHRDbGlja3Nbc3F1YXJlS2V5XTtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0Q2xpY2tlZCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tHcm91cC5yZW1vdmVDaGlsZChyaWdodENsaWNrZWQucmVjdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tzW3NxdWFyZUtleV0gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJpZ2h0Q2xpY2tIaWdobGlnaHQoc3F1YXJlS2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJvdGF0ZShpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbih0aGlzLnNvdXJjZUhpZ2hsaWdodCk7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbih0aGlzLnRhcmdldEhpZ2hsaWdodCk7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnJpZ2h0Q2xpY2tzKS5mb3JFYWNoKHJpZ2h0Q2xpY2sgPT57XHJcbiAgICAgICAgICAgIGlmIChyaWdodENsaWNrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24ocmlnaHRDbGljayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFNvdXJjZUFuZFRhcmdldChmcm9tOnN0cmluZywgdG86c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmNsZWFyQWxsSGlnaGxpZ2h0cygpO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0U291cmNlKGZyb20pO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGFyZ2V0KHRvKTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFNvdXJjZShmcm9tOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VIaWdobGlnaHQuc3F1YXJlS2V5ID0gZnJvbTtcclxuICAgICAgICB0aGlzLnNvdXJjZUhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy5zb3VyY2VDb2xvcik7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbih0aGlzLnNvdXJjZUhpZ2hsaWdodCk7XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHRUYXJnZXQodG86c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnRhcmdldEhpZ2hsaWdodC5zcXVhcmVLZXkgPSB0bztcclxuICAgICAgICB0aGlzLnRhcmdldEhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy50YXJnZXRDb2xvcik7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbih0aGlzLnRhcmdldEhpZ2hsaWdodCk7XHJcbiAgICB9XHJcbiAgICBjbGVhclNvdXJjZUFuZFRhcmdldEhpZ2hsaWdodHMoKXtcclxuICAgICAgICB0aGlzLnNvdXJjZUhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKTtcclxuICAgICAgICB0aGlzLnRhcmdldEhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd1RhcmdldE9yU291cmNlKHNxdWFyZUtleTpzdHJpbmcsIGhpZ2hsaWdodDpIaWdobGlnaHQsIGNvbG9yOnN0cmluZyl7XHJcbiAgICAgICAgaGlnaGxpZ2h0LnNxdWFyZUtleSA9IHNxdWFyZUtleTtcclxuICAgICAgICBoaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGhpZ2hsaWdodCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNsZWFyQWxsSGlnaGxpZ2h0cygpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJTb3VyY2VBbmRUYXJnZXRIaWdobGlnaHRzKCk7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrcyA9IHt9O1xyXG4gICAgICAgIHRoaXMucmlnaHRDbGlja0dyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVJpZ2h0Q2xpY2tIaWdobGlnaHQoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgbGV0IGNvcmRzID0gU2hhcmVkLmdldENvcmRpbmF0ZXNCeVNxdWFyZUtleShzcXVhcmVLZXksIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICBsZXQgcmVjdCA9IFNWR1NxdWFyZS5jcmVhdGVSZWN0KGNvcmRzLngsIGNvcmRzLnkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLnJpZ2h0Q2xpY2tDb2xvcik7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrR3JvdXAuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrc1tzcXVhcmVLZXldID0ge3NxdWFyZUtleSwgdHlwZTogXCJSaWdodENsaWNrXCIsIHJlY3R9O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRQb3NpdGlvbihoaWdobGlnaHQ6SGlnaGxpZ2h0KXtcclxuICAgICAgICBsZXQgY29yZCA9IFNoYXJlZC5nZXRDb3JkaW5hdGVzQnlTcXVhcmVLZXkoaGlnaGxpZ2h0LnNxdWFyZUtleSwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIGhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcInhcIiwgKGNvcmQueCAqIDEwMCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgaGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCAoY29yZC55ICogMTAwKS50b1N0cmluZygpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlQm9hcmRSZWN0KHg6bnVtYmVyLCB5Om51bWJlciwgY29sb3I6c3RyaW5nKXtcclxuICAgICAgICBsZXQgcmVjdCA9IFNWR1NxdWFyZS5jcmVhdGVSZWN0KHgsIHkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBjb2xvciA9PT0gXCJsXCIgPyBcInJnYigyMzMsMjM3LDIwNClcIiA6IFwicmdiKDExOSwxNTMsODQpXCIpO1xyXG4gICAgICAgIHJldHVybiByZWN0O1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29yZHNMYXllcntcclxuICAgIHByaXZhdGUgZ3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGhvcml6b250YWxHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHByaXZhdGUgdmVydGljYWxHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHByaXZhdGUgaXNSb3RhdGVkOmJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50LCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJIZWx2ZXRpY2FcIik7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGUoXCJmb250LXdlaWdodFwiLCBcImJvbGRcIik7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwicmdiKDMwLDMwLDMwXCIpO1xyXG4gICAgICAgIHN2Z1Jvb3QuYXBwZW5kKHRoaXMuZ3JvdXApO1xyXG5cclxuICAgICAgICB0aGlzLmhvcml6b250YWxHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHRoaXMudmVydGljYWxHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHRoaXMuaG9yaXpvbnRhbEdyb3VwKTtcclxuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHRoaXMudmVydGljYWxHcm91cCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbEdyb3VwLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSg4NiwgNzk1LjUpXCIpO1xyXG4gICAgICAgIHRoaXMudmVydGljYWxHcm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoNSwgMTgpXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmdldEhvcml6b250YWxDb3Jkcyhpc1JvdGF0ZWQpLmZvckVhY2goKGxldHRlciwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICAgICAgZ3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGluZGV4ICogMTAwKS50b1N0cmluZygpICsgXCIsMClcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbEdyb3VwLmFwcGVuZENoaWxkKGdyb3VwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcInRleHRcIik7XHJcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwic2NhbGUoMC45KVwiKTtcclxuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IGxldHRlcjtcclxuICAgICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nZXRWZXJ0aWNhbENvcmRzKGlzUm90YXRlZCkuZm9yRWFjaCgobnVtYmVyLCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgICAgICBncm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArICsgKGluZGV4ICogMTAwKS50b1N0cmluZygpICsgXCIpXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsR3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwidGV4dFwiKTtcclxuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG51bWJlcjtcclxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJzY2FsZSgxKVwiKTtcclxuICAgICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEhvcml6b250YWxDb3Jkcyhpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGhvcml6b250YWxDb3JkcyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIiwgXCJIXCJdO1xyXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQgPyBob3Jpem9udGFsQ29yZHMucmV2ZXJzZSgpIDogaG9yaXpvbnRhbENvcmRzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWZXJ0aWNhbENvcmRzKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgdmVydGljYWxDb3JkcyA9IFtcIjhcIiwgXCI3XCIsIFwiNlwiLCBcIjVcIiwgXCI0XCIsIFwiM1wiLCBcIjJcIiwgXCIxXCJdO1xyXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQgPyB2ZXJ0aWNhbENvcmRzLnJldmVyc2UoKSA6IHZlcnRpY2FsQ29yZHM7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgICAgIGxldCBsZXR0ZXJzID0gdGhpcy5nZXRIb3Jpem9udGFsQ29yZHMoaXNSb3RhdGVkKTtcclxuICAgICAgICBsZXQgbnVtYmVycyA9IHRoaXMuZ2V0VmVydGljYWxDb3Jkcyhpc1JvdGF0ZWQpO1xyXG4gICAgICAgIEFycmF5LmZyb20odGhpcy5ob3Jpem9udGFsR3JvdXAuY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkLCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gbGV0dGVyc1tpbmRleF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgQXJyYXkuZnJvbSh0aGlzLnZlcnRpY2FsR3JvdXAuY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkLCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gbnVtYmVyc1tpbmRleF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUGllY2UgZnJvbSBcIi4uL1BpZWNlXCI7XHJcbmltcG9ydCBQaWVjZUZhY3RvcnkgZnJvbSBcIi4uL1BpZWNlRmFjdG9yeVwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuLi9TaGFyZWRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpZWNlTGF5ZXJ7XHJcbiAgICBwcml2YXRlIGdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuICAgIHByaXZhdGUgcG9zaXRpb25zOlJlY29yZDxzdHJpbmcsIFBpZWNlfHVuZGVmaW5lZD4gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmRDaGlsZCh0aGlzLmdyb3VwKTtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgIH1cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSB7fTtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBnZXRQaWVjZShzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbc3F1YXJlS2V5XTtcclxuICAgIH1cclxuICAgIGFkZFBpZWNlKGZlbkNoYXI6c3RyaW5nLCBzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBsZXQgcGllY2UgPSBQaWVjZUZhY3RvcnkuZ2V0KGZlbkNoYXIsIHNxdWFyZUtleSk7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChwaWVjZS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHBpZWNlKTtcclxuICAgICAgICByZXR1cm4gcGllY2U7XHJcbiAgICB9XHJcbiAgICB1bmRvUGllY2VSZW1vdmFsKHBpZWNlOlBpZWNlKXtcclxuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHBpZWNlLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24ocGllY2UpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlUGllY2VCeVNxdWFyZUtleShzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aGlzLnBvc2l0aW9uc1tzcXVhcmVLZXldITtcclxuICAgICAgICB0aGlzLmdyb3VwLnJlbW92ZUNoaWxkKHBpZWNlLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zW3NxdWFyZUtleV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHBpZWNlO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICBsZXQgcGllY2VzID0gT2JqZWN0LnZhbHVlcyh0aGlzLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSB7fTtcclxuICAgICAgICBwaWVjZXMuZm9yRWFjaChwaWVjZSA9PntcclxuICAgICAgICAgICAgaWYgKHBpZWNlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24ocGllY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzZXRQb3NpdGlvbihwaWVjZTpQaWVjZSl7XHJcbiAgICAgICAgbGV0IHNxdWFyZUtleSA9IHBpZWNlLnNxdWFyZUtleSE7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnNbc3F1YXJlS2V5XSA9IHBpZWNlO1xyXG4gICAgICAgIFNoYXJlZC5zZXRQb3NpdGlvbihwaWVjZS5lbGVtZW50LCBzcXVhcmVLZXksIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgIH1cclxuICAgIHB1dE9uVG9wKHBpZWNlOlBpZWNlKXtcclxuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHBpZWNlLmVsZW1lbnQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJvYXJkTGF5ZXIgZnJvbSBcIi4vTGF5ZXJzL0JvYXJkTGF5ZXJcIjtcclxuaW1wb3J0IEFycm93TGF5ZXIgZnJvbSBcIi4vTGF5ZXJzL0Fycm93TGF5ZXJcIjtcclxuaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi9TaGFyZWRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlRXZlbnRze1xyXG4gICAgc3ZnUm9vdDpTVkdTVkdFbGVtZW50O1xyXG4gICAgaXNSb3RhdGVkOmJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50LCBib2FyZExheWVyOkJvYXJkTGF5ZXIsIGFycm93TGF5ZXI6QXJyb3dMYXllciwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdCA9IHN2Z1Jvb3Q7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmIChpc1JpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgbGV0IHNxdWFyZUtleSA9IFNoYXJlZC5nZXRTcXVhcmVCeUN1cnNvclBvc2l0aW9uKHRoaXMuc3ZnUm9vdCwgZXZlbnQsIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgICAgIGJvYXJkTGF5ZXIub25SaWdodEJ1dHRvbkRvd24oc3F1YXJlS2V5KTtcclxuICAgICAgICAgICAgICAgIGFycm93TGF5ZXIub25SaWdodEJ1dHRvbkRvd24oc3F1YXJlS2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgYm9hcmRMYXllci5vbkxlZnRCdXR0b25Eb3duKCk7XHJcbiAgICAgICAgICAgICAgICBhcnJvd0xheWVyLm9uTGVmdEJ1dHRvbkRvd24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZXZlbnQ6TW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXNSaWdodENsaWNrID0gZXZlbnQuYnV0dG9uICYmIGV2ZW50LmJ1dHRvbiA9PSAyO1xyXG4gICAgICAgICAgICBpZiAoaXNSaWdodENsaWNrKXtcclxuICAgICAgICAgICAgICAgIGxldCBzcXVhcmVLZXkgPSBTaGFyZWQuZ2V0U3F1YXJlQnlDdXJzb3JQb3NpdGlvbih0aGlzLnN2Z1Jvb3QsIGV2ZW50LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgICAgICAgICBib2FyZExheWVyLm9uUmlnaHRCdXR0b25VcChzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICAgICAgYXJyb3dMYXllci5vblJpZ2h0QnV0dG9uVXAoc3F1YXJlS2V5KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSApO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgIH1cclxufSIsImltcG9ydCAqIGFzIGJpc2hvcCBmcm9tIFwiLi9hc3NldHMvcGllY2VzL2IuanNvblwiO1xyXG5pbXBvcnQgKiBhcyBraW5nIGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvay5qc29uXCI7XHJcbmltcG9ydCAqIGFzIGtuaWdodCBmcm9tIFwiLi9hc3NldHMvcGllY2VzL24uanNvblwiO1xyXG5pbXBvcnQgKiBhcyBwYXduIGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvcC5qc29uXCI7XHJcbmltcG9ydCAqIGFzIHF1ZWVuIGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvcS5qc29uXCI7XHJcbmltcG9ydCAqIGFzIHJvb2sgZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9yLmpzb25cIjtcclxuXHJcbmNvbnN0IHBpZWNlU1ZHRGF0YTpSZWNvcmQ8c3RyaW5nLCBHcm91cD4gPSB7fTtcclxucGllY2VTVkdEYXRhW1wicFwiXSA9IHBhd24uZyBhcyBHcm91cDtcclxucGllY2VTVkdEYXRhW1wiclwiXSA9IHJvb2suZyBhcyBHcm91cDtcclxucGllY2VTVkdEYXRhW1wiblwiXSA9IGtuaWdodC5nIGFzIEdyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJiXCJdID0gYmlzaG9wLmcgYXMgR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcInFcIl0gPSBxdWVlbi5nIGFzIEdyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJrXCJdID0ga2luZy5nIGFzIEdyb3VwO1xyXG5cclxuaW50ZXJmYWNlIEdyb3Vwe1xyXG4gICAgZzogR3JvdXB8dW5kZWZpbmVkO1xyXG4gICAgdHJhbnNmb3JtOnN0cmluZ3x1bmRlZmluZWQ7XHJcbiAgICBzdHlsZTpzdHJpbmdbXXx1bmRlZmluZWQ7XHJcbiAgICBwYXRoOlBhdGhbXXx1bmRlZmluZWR8bnVsbDtcclxuICAgIGNpcmNsZTpDaXJjbGVbXXx1bmRlZmluZWQ7XHJcbn1cclxuaW50ZXJmYWNlIFBhdGh7XHJcbiAgICBzdHlsZTpzdHJpbmdbXXx1bmRlZmluZWQ7XHJcbiAgICBkOnN0cmluZztcclxuICAgIGNvbG9ySW5kZXg6bnVtYmVyfHVuZGVmaW5lZDtcclxufVxyXG5pbnRlcmZhY2UgQ2lyY2xle1xyXG4gICAgY3g6c3RyaW5nO1xyXG4gICAgY3k6c3RyaW5nO1xyXG4gICAgcjpzdHJpbmc7XHJcbn1cclxuY29uc3QgcGllY2VFbGVtZW50VHlwZXM6UmVjb3JkPHN0cmluZywgU1ZHR0VsZW1lbnQ+ID0ge307XHJcbltcInBcIixcIm5cIixcImJcIixcInJcIixcInFcIixcImtcIixcIlBcIixcIk5cIixcIkJcIixcIlJcIixcIlFcIixcIktcIl0uZm9yRWFjaChmZW5DaGFyID0+e1xyXG4gICAgbGV0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgIGxldCBkYXRhID0gcGllY2VTVkdEYXRhW2ZlbkNoYXIudG9Mb3dlckNhc2UoKV07XHJcbiAgICBsZXQgY29sb3IgPSBmZW5DaGFyID09PSBmZW5DaGFyLnRvTG93ZXJDYXNlKCkgPyAwIDogMTtcclxuICAgIGxvYWRDaGlsZHJlbihnLCBkYXRhLCBjb2xvcik7XHJcbiAgICBwaWVjZUVsZW1lbnRUeXBlc1tmZW5DaGFyXSA9IGc7XHJcbn0pO1xyXG5mdW5jdGlvbiBsb2FkQ2hpbGRyZW4oZzpTVkdHRWxlbWVudCwgZ3JvdXA6R3JvdXAsIGNvbG9yOm51bWJlcil7XHJcbiAgICBpZiAoZ3JvdXAudHJhbnNmb3JtKXtcclxuICAgICAgICBnLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBncm91cC50cmFuc2Zvcm0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLnN0eWxlICYmIGdyb3VwLnN0eWxlW2NvbG9yXSl7XHJcbiAgICAgICAgZy5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBncm91cC5zdHlsZVtjb2xvcl0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLmNpcmNsZSl7XHJcbiAgICAgICAgZ3JvdXAuY2lyY2xlLmZvckVhY2goY2lyY2xlID0+e1xyXG4gICAgICAgICAgICBsZXQgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnY2lyY2xlJyk7XHJcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKFwiY3hcIiwgY2lyY2xlLmN4KTtcclxuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjaXJjbGUuY3kpO1xyXG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShcInJcIiwgY2lyY2xlLnIpO1xyXG4gICAgICAgICAgICBnLmFwcGVuZENoaWxkKGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLnBhdGgpe1xyXG4gICAgICAgIGdyb3VwLnBhdGguZm9yRWFjaChwYXRoID0+e1xyXG4gICAgICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xyXG4gICAgICAgICAgICBpZiAocGF0aC5jb2xvckluZGV4ID09PSB1bmRlZmluZWQgfHwgcGF0aC5jb2xvckluZGV4ID09PSBjb2xvcil7XHJcbiAgICAgICAgICAgICAgICBwLnNldEF0dHJpYnV0ZShcImRcIiwgcGF0aC5kKTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLnN0eWxlKXtcclxuICAgICAgICAgICAgICAgICAgICBwLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIHBhdGguc3R5bGVbY29sb3JdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmIChncm91cC5nKXtcclxuICAgICAgICBsZXQgY2hpbGRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIGcuYXBwZW5kQ2hpbGQoY2hpbGRHcm91cCk7XHJcbiAgICAgICAgbG9hZENoaWxkcmVuKGNoaWxkR3JvdXAsIGdyb3VwLmcsIGNvbG9yKTtcclxuICAgIH1cclxufVxyXG5uYW1lc3BhY2UgUGllY2VFbGVtZW50RmFjdG9yeXtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXQoZmVuQ2hhcjpzdHJpbmcpOlNWR0dFbGVtZW50e1xyXG4gICAgICAgIHJldHVybiBwaWVjZUVsZW1lbnRUeXBlc1tmZW5DaGFyXS5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHR0VsZW1lbnQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgUGllY2VFbGVtZW50RmFjdG9yeTtcclxuIiwiaW1wb3J0IFBpZWNlIGZyb20gXCIuL1BpZWNlXCI7XHJcbmltcG9ydCBQaWVjZUVsZW1lbnRGYWN0b3J5IGZyb20gXCIuL1BpZWNlRWxlbWVudEZhY3RvcnlcIjtcclxuXHJcbm5hbWVzcGFjZSBQaWVjZUZhY3Rvcnl7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0KGZlbkNoYXI6c3RyaW5nLCBzcXVhcmVLZXk/OnN0cmluZyl7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBQaWVjZUVsZW1lbnRGYWN0b3J5LmdldChmZW5DaGFyKTtcclxuICAgICAgICByZXR1cm4geyBmZW5DaGFyLCBlbGVtZW50LCBzcXVhcmVLZXkgfSBhcyBQaWVjZTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBQaWVjZUZhY3Rvcnk7IiwibmFtZXNwYWNlIFNoYXJlZHtcclxuICAgIGNvbnN0IHNxdWFyZUtleXMgPSBbXCJhOFwiLCBcImI4XCIsIFwiYzhcIiwgXCJkOFwiLCBcImU4XCIsIFwiZjhcIiwgXCJnOFwiLCBcImg4XCIsIFwiYTdcIiwgXCJiN1wiLCBcImM3XCIsIFwiZDdcIiwgXCJlN1wiLCBcImY3XCIsIFwiZzdcIiwgXCJoN1wiLCBcImE2XCIsIFwiYjZcIiwgXCJjNlwiLCBcImQ2XCIsIFwiZTZcIiwgXCJmNlwiLCBcImc2XCIsIFwiaDZcIiwgXCJhNVwiLCBcImI1XCIsIFwiYzVcIiwgXCJkNVwiLCBcImU1XCIsIFwiZjVcIiwgXCJnNVwiLCBcImg1XCIsIFwiYTRcIiwgXCJiNFwiLCBcImM0XCIsIFwiZDRcIiwgXCJlNFwiLCBcImY0XCIsIFwiZzRcIiwgXCJoNFwiLCBcImEzXCIsIFwiYjNcIiwgXCJjM1wiLCBcImQzXCIsIFwiZTNcIiwgXCJmM1wiLCBcImczXCIsIFwiaDNcIiwgXCJhMlwiLCBcImIyXCIsIFwiYzJcIiwgXCJkMlwiLCBcImUyXCIsIFwiZjJcIiwgXCJnMlwiLCBcImgyXCIsIFwiYTFcIiwgXCJiMVwiLCBcImMxXCIsIFwiZDFcIiwgXCJlMVwiLCBcImYxXCIsIFwiZzFcIiwgXCJoMVwiXTtcclxuICAgIGNvbnN0IGhvcml6b250YWwgPSBbXCJhXCIsIFwiYlwiLCBcImNcIiwgXCJkXCIsIFwiZVwiLCBcImZcIiwgXCJnXCIsIFwiaFwiXTtcclxuICAgIGNvbnN0IHZlcnRpY2FsID0gW1wiOFwiLCBcIjdcIiwgXCI2XCIsIFwiNVwiLCBcIjRcIiwgXCIzXCIsIFwiMlwiLCBcIjFcIl07XHJcbiAgICBcclxuICAgIGV4cG9ydCBjb25zdCBzdGFydEZFTiA9IFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIjtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3F1YXJlS2V5QnlJbmRleGVzKGhvcml6b250YWxJbmRleDpudW1iZXIsIHZlcnRpY2FsSW5kZXg6bnVtYmVyLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGxldHRlckluZGV4ID0gaXNSb3RhdGVkID8gNyAtIGhvcml6b250YWxJbmRleCA6IGhvcml6b250YWxJbmRleDtcclxuICAgICAgICBsZXQgZGlnaXRJbmRleCA9IGlzUm90YXRlZCA/IDcgLSB2ZXJ0aWNhbEluZGV4IDogdmVydGljYWxJbmRleDtcclxuICAgICAgICByZXR1cm4gaG9yaXpvbnRhbFtsZXR0ZXJJbmRleF0gKyB2ZXJ0aWNhbFtkaWdpdEluZGV4XTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTcXVhcmVLZXlCeUluZGV4KGluZGV4Om51bWJlciwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpID0gaXNSb3RhdGVkID8gNjMgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgICAgIHJldHVybiBzcXVhcmVLZXlzW2ldO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRJbmRleE9mU3F1YXJlS2V5KHNxdWFyZUtleTpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgaW5kZXggPSBzcXVhcmVLZXlzLmluZGV4T2Yoc3F1YXJlS2V5KTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNjMgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEhvcml6b250YWxJbmRleChzcXVhcmVMZXR0ZXI6c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gaG9yaXpvbnRhbC5pbmRleE9mKHNxdWFyZUxldHRlcik7XHJcbiAgICAgICAgcmV0dXJuIGlzUm90YXRlZCA/IDcgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnRpY2FsSW5kZXgoc3F1YXJlTnVtYmVyOnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpbmRleCA9IHZlcnRpY2FsLmluZGV4T2Yoc3F1YXJlTnVtYmVyKTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q29yZGluYXRlc0J5U3F1YXJlS2V5KHNxdWFyZUtleTpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgeCA9IGdldEhvcml6b250YWxJbmRleChzcXVhcmVLZXlbMF0sIGlzUm90YXRlZCk7XHJcbiAgICAgICAgbGV0IHkgPSBnZXRWZXJ0aWNhbEluZGV4KHNxdWFyZUtleVsxXSwgaXNSb3RhdGVkKTtcclxuICAgICAgICByZXR1cm4geyB4LCB5IH07XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0UG9zaXRpb24oZWxlbWVudDpTVkdHRWxlbWVudCwgc3F1YXJlS2V5OnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBjb3JkcyA9IGdldENvcmRpbmF0ZXNCeVNxdWFyZUtleShzcXVhcmVLZXksIGlzUm90YXRlZCk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBjb3Jkcy54ICogMTAwICsgXCIsXCIgKyBjb3Jkcy55ICogMTAwICsgXCIpXCIpO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFNxdWFyZUJ5Q3Vyc29yUG9zaXRpb24oYm9hcmRTVkc6U1ZHU1ZHRWxlbWVudCwgZXZlbnQ6TW91c2VFdmVudCwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBzdmdQYXJlbnQgPSBib2FyZFNWRy5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGxldCBib2FyZFdpZHRoQW5kSGVpZ2h0ID0gc3ZnUGFyZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIGxldCBzcXVhcmVXaWR0aEFuZEhlaWdodCA9IGJvYXJkV2lkdGhBbmRIZWlnaHQgLyA4O1xyXG4gICAgICAgIGxldCBib2FyZENvb3JkaW5hdGVYID0gZXZlbnQuY2xpZW50WCAtIHN2Z1BhcmVudC5vZmZzZXRMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgICAgbGV0IGJvYXJkQ29vcmRpbmF0ZVkgPSBldmVudC5jbGllbnRZIC0gc3ZnUGFyZW50Lm9mZnNldFRvcCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICAgICAgbGV0IHNxdWFyZUluZGV4WD0gTWF0aC5mbG9vcihib2FyZENvb3JkaW5hdGVYIC8gc3F1YXJlV2lkdGhBbmRIZWlnaHQpO1xyXG4gICAgICAgIGxldCBzcXVhcmVJbmRleFkgPSBNYXRoLmZsb29yKGJvYXJkQ29vcmRpbmF0ZVkgLyBzcXVhcmVXaWR0aEFuZEhlaWdodCk7XHJcbiAgICAgICAgcmV0dXJuIGdldFNxdWFyZUtleUJ5SW5kZXhlcyhzcXVhcmVJbmRleFgsIHNxdWFyZUluZGV4WSwgaXNSb3RhdGVkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaGFyZWQ7XHJcbiIsIm5hbWVzcGFjZSBTVkdTcXVhcmV7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVjdCh4Om51bWJlciwgeTpudW1iZXIpe1xyXG4gICAgICAgIGxldCByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdyZWN0Jyk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsICh4ICogMTAwKS50b1N0cmluZygpKTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgKHkgKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIxMDBcIik7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgXCIxMDBcIik7XHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgU1ZHU3F1YXJlIiwiaW1wb3J0IFBpZWNlRWxlbWVudEZhY3RvcnkgZnJvbSBcIi4uL2NoZXNzYm9hcmQvUGllY2VFbGVtZW50RmFjdG9yeVwiO1xyXG5cclxuY29uc3QgcGllY2VUeXBlczogUmVjb3JkPHN0cmluZywgU1ZHU1ZHRWxlbWVudD4gPSB7fTtcclxuXHJcbltcInBcIixcIm5cIixcImJcIixcInJcIixcInFcIixcIlBcIixcIk5cIixcIkJcIixcIlJcIixcIlFcIl0uZm9yRWFjaChmZW5DaGFyID0+e1xyXG4gICAgbGV0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJzdmdcIik7XHJcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAxMDAgMTAwJyk7XHJcbiAgICBsZXQgcGllY2UgPSBQaWVjZUVsZW1lbnRGYWN0b3J5LmdldChmZW5DaGFyKTtcclxuICAgIHN2Zy5hcHBlbmRDaGlsZChwaWVjZSk7XHJcbiAgICBwaWVjZVR5cGVzW2ZlbkNoYXJdID0gc3ZnIGFzIFNWR1NWR0VsZW1lbnQ7XHJcbn0pO1xyXG5leHBvcnQgbmFtZXNwYWNlIENhcHR1cmVQaWVjZUZhY3Rvcnl7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0KGZlbkNoYXI6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gcGllY2VUeXBlc1tmZW5DaGFyXS5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHU1ZHRWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiIsImltcG9ydCBDaGVzc2JvYXJkIGZyb20gXCIuLi9jaGVzc2JvYXJkL0NoZXNzYm9hcmRcIjtcclxuaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi4vY2hlc3Nib2FyZC9TaGFyZWRcIjtcclxuaW1wb3J0IFBsYXllckluZm8gZnJvbSBcIi4vUGxheWVySW5mb1wiO1xyXG5pbXBvcnQge1RyYW5zaXRpb25zLCBUcmFuc2l0aW9uSW5mb30gZnJvbSBcIi4vVHJhbnNpdGlvbnNcIjtcclxuaW1wb3J0IFBpZWNlRmFjdG9yeSBmcm9tIFwiLi4vY2hlc3Nib2FyZC9QaWVjZUZhY3RvcnlcIjtcclxuaW1wb3J0IFBpZWNlIGZyb20gXCIuLi9jaGVzc2JvYXJkL1BpZWNlXCI7XHJcbmltcG9ydCBDYXN0bGluZyBmcm9tIFwiLi9DYXN0bGluZ1wiO1xyXG5pbXBvcnQgeyBNb3ZlIH0gZnJvbSBcImNoZXNzLmpzXCI7XHJcbmltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcclxuaW1wb3J0IFwiLi9nYW1lTmF2aWdhdG9yLmNzc1wiO1xyXG5cclxudHlwZSBTdGF0ZSA9IFwic3RhcnRcIiB8IFwicmV3aW5kXCIgfCBcInBsYXlcIiB8IFwicGF1c2VcIiB8IFwiZm9yd2FyZFwiIHwgXCJlbmRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVCcm93c2Vye1xyXG4gICAgY2hlc3Nib2FyZDpDaGVzc2JvYXJkO1xyXG4gICAgaXNSb3RhdGVkOmJvb2xlYW47XHJcbiAgICBwbGF5ZXJJbmZvOlBsYXllckluZm87XHJcbiAgICB0cmFuc2l0aW9uczpUcmFuc2l0aW9ucztcclxuICAgIHN0YXRlOlN0YXRlID0gXCJzdGFydFwiO1xyXG4gICAgbW92ZXM6TW92ZVtdID0gW107XHJcbiAgICBtb3ZlSW5kZXggPSAwO1xyXG4gICAgc2hvcnREZWxheUJldHdlZW5Nb3ZlcyA9IDIwMDtcclxuICAgIGxvbmdEZWxheUJldHdlZW5Nb3ZlcyA9IDEwMDA7XHJcbiAgICBzaG9ydFRyYW5zaXRpb25EdXJhdGlvbiA9IFwiNTAwbXNcIjtcclxuICAgIGxvbmdUcmFuc2l0aW9uRHVyYXRpb24gPSBcIjIwMDBtc1wiO1xyXG4gICAgdGltZW91dElkOk5vZGVKUy5UaW1lb3V0fHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6SFRNTEVsZW1lbnQsIGZlbjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQgPSBuZXcgQ2hlc3Nib2FyZChjb250YWluZXIsIGZlbiwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgUGxheWVySW5mbyhjb250YWluZXIsIGZlbiwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25zKHRoaXMuY2hlc3Nib2FyZCwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgIH1cclxuICAgIHJvdGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gIXRoaXMuaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuY2hlc3Nib2FyZC5yb3RhdGUoKTtcclxuICAgICAgICB0aGlzLnBsYXllckluZm8ucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnRyYW5zaXRpb25zLnJvdGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgbG9hZEdhbWUoZ2FtZTpHYW1lKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0RmVuKFNoYXJlZC5zdGFydEZFTiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJbmZvLnNldFBsYXllck5hbWVzKGdhbWUuYmxhY2tQbGF5ZXIsIGdhbWUud2hpdGVQbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMucGxheWVySW5mby5zZXRTY29yZUFuZENhcHV0ZXJlQnlGZW4oU2hhcmVkLnN0YXJ0RkVOKTtcclxuICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICB0aGlzLm1vdmVJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInN0YXJ0XCI7XHJcbiAgICB9XHJcbiAgICByZXdpbmQoKXtcclxuICAgICAgICB0aGlzLnN0YXRlID0gXCJyZXdpbmRcIjtcclxuICAgICAgICB0aGlzLm1vdmUoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcHJldmlvdXMoKXtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJmb3J3YXJkXCIpe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJwYXVzZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vdmUoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcGxheSgpe1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInBsYXlcIjtcclxuICAgICAgICB0aGlzLm1vdmUodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBwYXVzZSgpe1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInBhdXNlXCI7XHJcbiAgICB9XHJcbiAgICBuZXh0KCl7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwicmV3aW5kXCIpe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJwYXVzZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vdmUodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBmb3J3YXJkKCl7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwiZm9yd2FyZFwiO1xyXG4gICAgICAgIHRoaXMubW92ZSh0cnVlKTtcclxuICAgIH1cclxuICAgIGdvVG9Nb3ZlKGluZGV4Om51bWJlcil7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9ucy5jdXJyZW50KXtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9ucy5jYW5jZWwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tb3ZlSW5kZXggPSBpbmRleDtcclxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwic3RhcnRcIjtcclxuICAgICAgICAgICAgbGV0IG1vdmUgPSB0aGlzLm1vdmVzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0RmVuKG1vdmUuYmVmb3JlLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJJbmZvLnNldFNjb3JlQW5kQ2FwdXRlcmVCeUZlbihtb3ZlLmJlZm9yZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5jbGVhclNvdXJjZUFuZFRhcmdldEhpZ2hsaWdodHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0aGlzLm1vdmVzLmxlbmd0aCAtMSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJlbmRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwicGF1c2VcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbW92ZSA9IHRoaXMubW92ZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0RmVuKG1vdmUuYWZ0ZXIsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckluZm8uc2V0U2NvcmVBbmRDYXB1dGVyZUJ5RmVuKG1vdmUuYWZ0ZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0U291cmNlQW5kVGFyZ2V0KG1vdmUuZnJvbSwgbW92ZS50byk7XHJcbiAgICAgICAgICAgIGxldCBjYXN0bGluZyA9IHRoaXMuZ2V0Q2FzdGxpbmcobW92ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChjYXN0bGluZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0U291cmNlKGNhc3RsaW5nLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgYXN5bmMgbW92ZShpc0ZvcndhcmQ6Ym9vbGVhbil7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcclxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9ucy5jdXJyZW50KXtcclxuICAgICAgICAgICAgbGV0IHRyYW5zaXRpb24gPSB0aGlzLnRyYW5zaXRpb25zLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIGxldCBwaWVjZSA9IHRyYW5zaXRpb24ucGllY2U7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlID0gdHJhbnNpdGlvbi5tb3ZlO1xyXG4gICAgICAgICAgICBsZXQgY2FzdGxpbmcgPSB0cmFuc2l0aW9uLmNhc3RsaW5nO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25zLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICBpZiAoaXNGb3J3YXJkID09PSB0cmFuc2l0aW9uLmlzRm9yd2FyZCl7IC8vIElmIGRpcmVjdGlvbiBoYXMgbm90IGNoYW5nZWRcclxuICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoTW92ZShpc0ZvcndhcmQsIHBpZWNlLCBtb3ZlLCBjYXN0bGluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNGb3J3YXJkKXsvL01vdmluZyBiYWNrIHdhcyBjYW5jZWxsZWQgc28gcmVjYXB0dXJlIGFuZCByZXByb21vdGUgaWYgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5jYXB0dXJlZCl7Ly9yZWNhcHR1cmVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQucmVtb3ZlUGllY2VCeVNxdWFyZUtleShtb3ZlLnRvKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllckluZm8uYWRkQ2FwdHVyZShtb3ZlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0UGllY2VQb3NpdGlvbihwaWVjZSwgbW92ZS50byk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5wcm9tb3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9tb3Rpb25GZW5DaGFyID0gbW92ZS5jb2xvciA9PT0gXCJiXCIgPyBtb3ZlLnByb21vdGlvbiA6IG1vdmUucHJvbW90aW9uLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnJlbW92ZVBpZWNlQnlTcXVhcmVLZXkobW92ZS50byk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmFkZFBpZWNlKHByb21vdGlvbkZlbkNoYXIsIG1vdmUudG8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7Ly9Nb3ZpbmcgZm9yd2FyZCB3YXMgY2FuY2VsbGVkIHNvIHVuZG8gbW92ZUluZGV4KytcclxuICAgICAgICAgICAgICAgIHRoaXMubW92ZUluZGV4LS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzRm9yd2FyZCAmJiB0aGlzLm1vdmVJbmRleCA9PT0gdGhpcy5tb3Zlcy5sZW5ndGggLTEpe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJlbmRcIjtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghaXNGb3J3YXJkICYmIHRoaXMubW92ZUluZGV4ID09PSAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5jbGVhclNvdXJjZUFuZFRhcmdldEhpZ2hsaWdodHMoKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwic3RhcnRcIjtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNGb3J3YXJkKXtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlSW5kZXgrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1vdmUgPSB0aGlzLm1vdmVzW3RoaXMubW92ZUluZGV4XTtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aGlzLmNoZXNzYm9hcmQuZ2V0UGllY2UoaXNGb3J3YXJkID8gbW92ZS5mcm9tIDogbW92ZS50bykhO1xyXG4gICAgICAgIGxldCBjYXN0bGluZyA9IHRoaXMuZ2V0Q2FzdGxpbmcobW92ZSwgaXNGb3J3YXJkKTtcclxuICAgICAgICBpZiAoaXNGb3J3YXJkKXtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmhpZ2hsaWdodFNvdXJjZShtb3ZlLmZyb20pO1xyXG4gICAgICAgICAgICBpZiAoY2FzdGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmhpZ2hsaWdodFRhcmdldChjYXN0bGluZy5mcm9tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0VGFyZ2V0KG1vdmUudG8pO1xyXG4gICAgICAgICAgICBpZiAoY2FzdGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmhpZ2hsaWdodFNvdXJjZShjYXN0bGluZy50byk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1vdmUucHJvbW90aW9uKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5yZW1vdmVQaWVjZUJ5U3F1YXJlS2V5KG1vdmUudG8pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZlbkNoYXIgPSBtb3ZlLmNvbG9yID09PSBcImJcIiA/IG1vdmUucGllY2UgOiBtb3ZlLnBpZWNlLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBwaWVjZSA9IFBpZWNlRmFjdG9yeS5nZXQoZmVuQ2hhcik7XHJcbiAgICAgICAgICAgICAgICBTaGFyZWQuc2V0UG9zaXRpb24ocGllY2UuZWxlbWVudCwgbW92ZS50bywgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtb3ZlLmNhcHR1cmVkKXtcclxuICAgICAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllckluZm8udW5kb0NhcHR1cmUobW92ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaChleCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FwdHVyZWRGZW5DaGFyID0gbW92ZS5jb2xvciA9PT0gXCJiXCIgPyBtb3ZlLmNhcHR1cmVkLnRvVXBwZXJDYXNlKCkgOiBtb3ZlLmNhcHR1cmVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmFkZFBpZWNlKGNhcHR1cmVkRmVuQ2hhciwgbW92ZS50byk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb25JbmZvOlRyYW5zaXRpb25JbmZvID0geyBpc0ZvcndhcmQsIHBpZWNlLCBtb3ZlLCBjYXN0bGluZyB9XHJcblxyXG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMuc3RhdGUgPT09IFwicGxheVwiID8gdGhpcy5sb25nVHJhbnNpdGlvbkR1cmF0aW9uIDogdGhpcy5zaG9ydFRyYW5zaXRpb25EdXJhdGlvbjtcclxuICAgICAgICBhd2FpdCB0aGlzLnRyYW5zaXRpb25zLm1vdmUodHJhbnNpdGlvbkluZm8sIGR1cmF0aW9uLCAoKSA9PntcclxuICAgICAgICAgICAgLy9PblRyYW5zaXRpb25FbmRcclxuICAgICAgICAgICAgdGhpcy5maW5pc2hNb3ZlKGlzRm9yd2FyZCwgcGllY2UsIG1vdmUsIGNhc3RsaW5nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZmluaXNoTW92ZShpc0ZvcndhcmQ6Ym9vbGVhbiwgcGllY2U6UGllY2UsIG1vdmU6TW92ZSwgY2FzdGxpbmc6Q2FzdGxpbmd8dW5kZWZpbmVkKXtcclxuICAgICAgICBpZiAoY2FzdGxpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0UGllY2VQb3NpdGlvbihjYXN0bGluZy5yb29rLCBpc0ZvcndhcmQgPyBjYXN0bGluZy50byA6IGNhc3RsaW5nLmZyb20pO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0UGllY2VQb3NpdGlvbihwaWVjZSwgaXNGb3J3YXJkID8gbW92ZS50byA6IG1vdmUuZnJvbSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5oaWdobGlnaHRTb3VyY2UoaXNGb3J3YXJkID8gY2FzdGxpbmcudG8gOiBjYXN0bGluZy5mcm9tKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmhpZ2hsaWdodFRhcmdldChpc0ZvcndhcmQgPyBtb3ZlLnRvIDogbW92ZS5mcm9tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNGb3J3YXJkKXtcclxuICAgICAgICAgICAgaWYgKG1vdmUuY2FwdHVyZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnJlbW92ZVBpZWNlQnlTcXVhcmVLZXkobW92ZS50byk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllckluZm8uYWRkQ2FwdHVyZShtb3ZlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtb3ZlLnByb21vdGlvbil7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvbW90aW9uRmVuQ2hhciA9IG1vdmUuY29sb3IgPT09IFwiYlwiID8gbW92ZS5wcm9tb3Rpb24gOiBtb3ZlLnByb21vdGlvbi50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnJlbW92ZVBpZWNlQnlTcXVhcmVLZXkobW92ZS5mcm9tKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlc3Nib2FyZC5hZGRQaWVjZShwcm9tb3Rpb25GZW5DaGFyLCBtb3ZlLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnNldFBpZWNlUG9zaXRpb24ocGllY2UsIG1vdmUudG8pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmhpZ2hsaWdodFRhcmdldChtb3ZlLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0UGllY2VQb3NpdGlvbihwaWVjZSwgbW92ZS5mcm9tKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmhpZ2hsaWdodFNvdXJjZShtb3ZlLmZyb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWlzRm9yd2FyZCl7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUluZGV4LS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuc3RhdGUgPT09IFwicGxheVwiIHx8IHRoaXMuc3RhdGUgPT09IFwiZm9yd2FyZFwiIHx8IHRoaXMuc3RhdGUgPT09IFwicmV3aW5kXCIpe1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBcInBsYXlcIiB8fCB0aGlzLnN0YXRlID09PSBcImZvcndhcmRcIiB8fCB0aGlzLnN0YXRlID09PSBcInJld2luZFwiKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmUoaXNGb3J3YXJkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5zdGF0ZSA9PT0gXCJwbGF5XCIgPyB0aGlzLmxvbmdEZWxheUJldHdlZW5Nb3ZlcyA6IHRoaXMuc2hvcnREZWxheUJldHdlZW5Nb3Zlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRDYXN0bGluZyhtb3ZlOk1vdmUsIGlzRm9yd2FyZDpib29sZWFuKXtcclxuICAgICAgICBpZiAobW92ZS5zYW5bMF0gPT09IFwiT1wiKXtcclxuICAgICAgICAgICAgbGV0IGZyb20gPSBtb3ZlLmNvbG9yID09PSBcIndcIiA/IChtb3ZlLnNhbiA9PT0gXCJPLU9cIiA/IFwiaDFcIiA6IFwiYTFcIikgOiAobW92ZS5zYW4gPT09IFwiTy1PXCIgPyBcImg4XCIgOiBcImE4XCIpO1xyXG4gICAgICAgICAgICBsZXQgdG8gPSBtb3ZlLmNvbG9yID09PSBcIndcIiA/IChtb3ZlLnNhbiA9PT0gXCJPLU9cIiA/IFwiZjFcIiA6IFwiZDFcIikgOiAobW92ZS5zYW4gPT09IFwiTy1PXCIgPyBcImY4XCI6IFwiZDhcIik7XHJcbiAgICAgICAgICAgIGxldCByb29rID0gdGhpcy5jaGVzc2JvYXJkLmdldFBpZWNlKGlzRm9yd2FyZCA/IGZyb20gOiB0bykhO1xyXG4gICAgICAgICAgICByZXR1cm4ge3Jvb2ssIGZyb20sIHRvfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENhcHR1cmVQaWVjZUZhY3RvcnkgfSBmcm9tIFwiLi9DYXB0dXJlUGllY2VGYWN0b3J5XCI7XHJcbmltcG9ydCB7IE1vdmUgfSBmcm9tIFwiY2hlc3MuanNcIjtcclxuXHJcbmNvbnN0IHBpZWNlVmFsdWVzOlJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7W1wicFwiXToxLFtcIm5cIl06MyxbXCJiXCJdOjMsW1wiclwiXTo1LFtcInFcIl06OSxbXCJrXCJdOjAsW1wiUFwiXTotMSxbXCJOXCJdOi0zLFtcIkJcIl06LTMsW1wiUlwiXTotNSxbXCJRXCJdOi05LFtcIktcIl06MH07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXJJbmZve1xyXG4gICAgcHJpdmF0ZSBjb250YWluZXI6SFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHdoaXRlUGxheWVyOkhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBibGFja1BsYXllcjpIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgd2hpdGVDYXB0dXJlczpSZWNvcmQ8c3RyaW5nLCBIVE1MRWxlbWVudD4gPSB7fTtcclxuICAgIHByaXZhdGUgYmxhY2tDYXB0dXJlczpSZWNvcmQ8c3RyaW5nLCBIVE1MRWxlbWVudD4gPSB7fTtcclxuICAgIHByaXZhdGUgd2hpdGVTY29yZTpIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgYmxhY2tTY29yZTpIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgd2hpdGVQbGF5ZXJOYW1lOkhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBibGFja1BsYXllck5hbWU6SFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOkhUTUxFbGVtZW50LCBmZW46c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5ibGFja1BsYXllciA9IHRoaXMuYWRkQ2hpbGQodGhpcy5jb250YWluZXIsIFwiZGl2XCIsIFwicGxheWVyIGJsYWNrIFwiICsgKGlzUm90YXRlZCA/IFwiYmVsb3dcIiA6IFwiYWJvdmVcIikpO1xyXG4gICAgICAgIHRoaXMud2hpdGVQbGF5ZXIgPSB0aGlzLmFkZENoaWxkKHRoaXMuY29udGFpbmVyLCBcImRpdlwiLCBcInBsYXllciB3aGl0ZSBcIiArIChpc1JvdGF0ZWQgPyBcImFib3ZlXCIgOiBcImJlbG93XCIpKTtcclxuXHJcbiAgICAgICAgbGV0IHBsYXllckFib3ZlQm9hcmQgPSBpc1JvdGF0ZWQgPyB0aGlzLndoaXRlUGxheWVyIDogdGhpcy5ibGFja1BsYXllcjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUocGxheWVyQWJvdmVCb2FyZCwgdGhpcy5jb250YWluZXIuZmlyc3RDaGlsZCEpO1xyXG5cclxuICAgICAgICBsZXQgYmxhY2tDYXB0dXJlID0gdGhpcy5hZGRDaGlsZCh0aGlzLmJsYWNrUGxheWVyLCBcImRpdlwiLCBcImNhcHR1cmVzXCIpO1xyXG4gICAgICAgIGxldCB3aGl0ZUNhcHR1cmUgPSB0aGlzLmFkZENoaWxkKHRoaXMud2hpdGVQbGF5ZXIsIFwiZGl2XCIsIFwiY2FwdHVyZXNcIik7XHJcblxyXG4gICAgICAgIGxldCByZWNvcmQgPSBbdGhpcy53aGl0ZUNhcHR1cmVzLCB0aGlzLmJsYWNrQ2FwdHVyZXNdO1xyXG4gICAgICAgIFt3aGl0ZUNhcHR1cmUsIGJsYWNrQ2FwdHVyZV0uZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBbXCJwXCIsIFwiblwiLCBcImJcIiwgXCJyXCIsIFwicVwiXS5mb3JFYWNoKHR5cGUgPT57XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmFkZENoaWxkKGVsZW1lbnQsIFwic3BhblwiLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIHJlY29yZFtpbmRleF1bdHlwZV0gPSBjaGlsZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy53aGl0ZVNjb3JlID0gdGhpcy5hZGRDaGlsZCh0aGlzLndoaXRlUGxheWVyLCBcInNwYW5cIiwgXCJzY29yZVwiKTtcclxuICAgICAgICB0aGlzLmJsYWNrU2NvcmUgPSB0aGlzLmFkZENoaWxkKHRoaXMuYmxhY2tQbGF5ZXIsIFwic3BhblwiLCBcInNjb3JlXCIpO1xyXG4gICAgICAgIHRoaXMud2hpdGVQbGF5ZXJOYW1lID0gdGhpcy5hZGRDaGlsZCh0aGlzLndoaXRlUGxheWVyLCBcImRpdlwiLCBcIm5hbWVcIiwgXCJXaGl0ZVwiKTtcclxuICAgICAgICB0aGlzLmJsYWNrUGxheWVyTmFtZSA9IHRoaXMuYWRkQ2hpbGQodGhpcy5ibGFja1BsYXllciwgXCJkaXZcIiwgXCJuYW1lXCIsIFwiQmxhY2tcIik7XHJcbiAgICAgICAgaWYgKGZlbil7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2NvcmVBbmRDYXB1dGVyZUJ5RmVuKGZlbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgcGxheWVyQWJvdmVCb2FyZCA9IGlzUm90YXRlZCA/IHRoaXMud2hpdGVQbGF5ZXIgOiB0aGlzLmJsYWNrUGxheWVyO1xyXG4gICAgICAgIGxldCBwbGF5ZXJCZWxvd0JvYXJkID0gaXNSb3RhdGVkID8gdGhpcy5ibGFja1BsYXllciA6IHRoaXMud2hpdGVQbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHBsYXllckFib3ZlQm9hcmQsIHRoaXMuY29udGFpbmVyLmZpcnN0Q2hpbGQhKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJCZWxvd0JvYXJkKTtcclxuICAgICAgICBwbGF5ZXJBYm92ZUJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJiZWxvd1wiKTtcclxuICAgICAgICBwbGF5ZXJCZWxvd0JvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJhYm92ZVwiKTtcclxuICAgICAgICBwbGF5ZXJBYm92ZUJvYXJkLmNsYXNzTGlzdC5hZGQoXCJhYm92ZVwiKTtcclxuICAgICAgICBwbGF5ZXJCZWxvd0JvYXJkLmNsYXNzTGlzdC5hZGQoXCJiZWxvd1wiKTtcclxuICAgIH1cclxuICAgIGFkZENhcHR1cmUobW92ZTpNb3ZlKXtcclxuICAgICAgICBsZXQgZmVuQ2hhciA9IHRoaXMuZ2V0Q29tcHV0ZWRDYXB0dXJlKG1vdmUpO1xyXG4gICAgICAgIHRoaXMuYWRkQ29tcHV0ZWRDYXB0dXJlKGZlbkNoYXIpO1xyXG4gICAgICAgIHRoaXMuc2V0U2NvcmVCeUZlbihtb3ZlLmFmdGVyKTtcclxuICAgIH1cclxuICAgIHVuZG9DYXB0dXJlKG1vdmU6TW92ZSl7XHJcbiAgICAgICAgbGV0IGZlbkNoYXIgPSB0aGlzLmdldENvbXB1dGVkQ2FwdHVyZShtb3ZlKTtcclxuICAgICAgICBsZXQgZmVuQ2hhckxvd2VyQ2FzZSA9IGZlbkNoYXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBsZXQgaXNCbGFjayA9IGZlbkNoYXIgPT09IGZlbkNoYXJMb3dlckNhc2U7XHJcbiAgICAgICAgbGV0IHNwYW4gPSBpc0JsYWNrID8gdGhpcy53aGl0ZUNhcHR1cmVzW2ZlbkNoYXJMb3dlckNhc2VdIDogdGhpcy5ibGFja0NhcHR1cmVzW2ZlbkNoYXJMb3dlckNhc2VdO1xyXG4gICAgICAgIHNwYW4ucmVtb3ZlQ2hpbGQoc3Bhbi5maXJzdENoaWxkISk7XHJcbiAgICAgICAgdGhpcy5zZXRTY29yZUJ5RmVuKG1vdmUuYmVmb3JlKTtcclxuICAgIH1cclxuICAgIHNldFBsYXllck5hbWVzKGJsYWNrOnN0cmluZywgd2hpdGU6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmJsYWNrUGxheWVyTmFtZS5pbm5lckhUTUwgPSBibGFjaztcclxuICAgICAgICB0aGlzLndoaXRlUGxheWVyTmFtZS5pbm5lckhUTUwgPSB3aGl0ZTtcclxuICAgIH1cclxuICAgIHNldFNjb3JlQW5kQ2FwdXRlcmVCeUZlbihmZW46c3RyaW5nKXsgICAgIFxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy53aGl0ZUNhcHR1cmVzKS5jb25jYXQoT2JqZWN0LnZhbHVlcyh0aGlzLmJsYWNrQ2FwdHVyZXMpKS5mb3JFYWNoKGVsZW1lbnQgPT57XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoZmVuID09PSBcInN0YXJ0XCIgfHwgZmVuID09PSBcIlwiKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRTY29yZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgbGV0IGNhcHR1cmVzID0gdGhpcy5nZXRDYXB0dXJlc0J5RmVuKGZlbik7XHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGNhcHR1cmVzKS5mb3JFYWNoKChbZmVuQ2hhciwgY291bnRdKSA9PntcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tcHV0ZWRDYXB0dXJlKGZlbkNoYXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2NvcmVCeUZlbihmZW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkQ29tcHV0ZWRDYXB0dXJlKGZlbkNoYXI6c3RyaW5nKXtcclxuICAgICAgICBsZXQgZmVuQ2hhckxvd2VyQ2FzZSA9IGZlbkNoYXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBsZXQgcGllY2UgPSBDYXB0dXJlUGllY2VGYWN0b3J5LmdldChmZW5DaGFyKTtcclxuICAgICAgICBsZXQgaXNCbGFjayA9IGZlbkNoYXIgPT09IGZlbkNoYXJMb3dlckNhc2U7XHJcbiAgICAgICAgbGV0IHNwYW4gPSBpc0JsYWNrID8gdGhpcy53aGl0ZUNhcHR1cmVzW2ZlbkNoYXJMb3dlckNhc2VdIDogdGhpcy5ibGFja0NhcHR1cmVzW2ZlbkNoYXJMb3dlckNhc2VdO1xyXG4gICAgICAgIHNwYW4uYXBwZW5kQ2hpbGQocGllY2UpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRTY29yZUJ5RmVuKGZlbjpzdHJpbmcpe1xyXG4gICAgICAgIGZlbiA9IGZlbi5zcGxpdChcIiBcIilbMF0uc3BsaXQoXCIvXCIpLmpvaW4oXCJcIik7XHJcbiAgICAgICAgbGV0IHNjb3JlID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgZmVuKXtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHBhcnNlSW50KGNoYXIpKSl7XHJcbiAgICAgICAgICAgICAgICBzY29yZSAtPSBwaWVjZVZhbHVlc1tjaGFyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFNjb3JlKHNjb3JlKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0U2NvcmUoc2NvcmU6bnVtYmVyKXtcclxuICAgICAgICBsZXQgd2hpdGVQcmVmaXggPSBzY29yZSA9PT0gMCA/IFwiXCIgOiAoc2NvcmUgPiAwID8gXCIrXCIgOiBcIi1cIik7XHJcbiAgICAgICAgbGV0IGJsYWNrUHJlZml4ID0gc2NvcmUgPT09IDAgPyBcIlwiIDogKHNjb3JlID4gMCA/IFwiLVwiIDogXCIrXCIpO1xyXG4gICAgICAgIHRoaXMud2hpdGVTY29yZS5pbm5lckhUTUwgPSBzY29yZSA9PT0gMCA/IFwiXCIgOiAod2hpdGVQcmVmaXggKyBNYXRoLmFicyhzY29yZSkpO1xyXG4gICAgICAgIHRoaXMuYmxhY2tTY29yZS5pbm5lckhUTUwgPSBzY29yZSA9PT0gMCA/IFwiXCIgOiAoYmxhY2tQcmVmaXggKyBNYXRoLmFicyhzY29yZSkpO1xyXG4gICAgfVxyXG4gICAgLy8gQSBwcm9tb3RlZCBwYXduIHdpbGwgb25seSBzaG93IGFzIGEgcGF3biBpbiB0aGUgY2FwdHVyZSBwYW5lbFxyXG4gICAgcHJpdmF0ZSBnZXRDb21wdXRlZENhcHR1cmUobW92ZTpNb3ZlKXtcclxuICAgICAgICBsZXQgY2FwdHVyZSA9IG1vdmUuY2FwdHVyZWQhO1xyXG4gICAgICAgIGxldCBmZW5DaGFyID0gbW92ZS5jb2xvciA9PT0gXCJiXCIgPyBjYXB0dXJlLnRvVXBwZXJDYXNlKCkgOiBjYXB0dXJlO1xyXG4gICAgICAgIGlmIChjYXB0dXJlICE9PSBcInBcIil7XHJcbiAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBtb3ZlLmFmdGVyKXtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwYXJzZUludChjaGFyKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFyID09PSBmZW5DaGFyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvdW50ID49IDIgfHwgKGNhcHR1cmUgPT09IFwicVwiICYmIGNvdW50ID49IDEpICl7XHJcbiAgICAgICAgICAgICAgICBmZW5DaGFyID0gbW92ZS5jb2xvciA9PT0gXCJiXCIgPyBcIlBcIiA6IFwicFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmZW5DaGFyO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRDYXB0dXJlc0J5RmVuKGZlbjpzdHJpbmcpOlJlY29yZDxzdHJpbmcsbnVtYmVyPntcclxuICAgICAgICAvLyBleGFtcGxlOiBcInJuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAxXCJcclxuICAgICAgICBmZW4gPSBmZW4uc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiL1wiKS5qb2luKFwiXCIpO1xyXG4gICAgICAgIC8vIG1ha2UgYSByZWNvcmQgb2YgYWxsIHR5cGVzIG9mIHBpZWNlcyBhbmQgc2V0IGluaXRpYWwgY291bnQgdG8gemVyb1xyXG4gICAgICAgIGxldCBmZW5DaGFyczogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xyXG4gICAgICAgIFtcInBcIixcIm5cIixcImJcIixcInJcIixcInFcIixcIlBcIixcIk5cIixcIkJcIixcIlJcIixcIlFcIl0uZm9yRWFjaChjaGFyID0+e1xyXG4gICAgICAgICAgICBmZW5DaGFyc1tjaGFyXSA9IDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGhvdyBtYW55IHBpZWNlcyB3ZSBoYXZlIG9mIGVhY2gga2luZFxyXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBmZW4pIHtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHBhcnNlSW50KGNoYXIpKSl7XHJcbiAgICAgICAgICAgICAgICBmZW5DaGFyc1tjaGFyXSArPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHJldHVybiBhIHNpbWlsYXIgcmVjb3JkIHNob3dpbmcgaG93IG1hbnkgcGllY2VzIGhhdmUgYmVlbiB0YWtlblxyXG4gICAgICAgIGxldCBjYXB0dXJlczogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xyXG4gICAgICAgIC8vIHdlIHN0YXJ0ZWQgaGF2aW5nIDIgcm9va3MsIGtuaWdodHMgYW5kIGJpc2hvcHMuIFdlIGNvdWxkIGhhdmUgbW9yZSBkdWUgdG8gcHJvbW90aW9uXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFtcInJcIiwgXCJuXCIsIFwiYlwiLCBcIlJcIiwgXCJOXCIsIFwiQlwiXSl7XHJcbiAgICAgICAgICAgIGNhcHR1cmVzW2NoYXJdID0gZmVuQ2hhcnNbY2hhcl0gPj0gMiA/IDAgOiAyIC0gZmVuQ2hhcnNbY2hhcl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbXCJxXCIsIFwiUVwiXSl7XHJcbiAgICAgICAgICAgIGNhcHR1cmVzW2NoYXJdID0gZmVuQ2hhcnNbY2hhcl0gPiAwID8gMCA6IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENvdW50aW5nIGNhcHR1cmVzIGlzIGRpZmZpY3VsdCBkdWUgdG8gcG9zc2libGUgcHJvbW90aW9uXHJcbiAgICAgICAgbGV0IGJsYWNrID0ge3Bhd246XCJwXCIsIHF1ZWVuOiBcInFcIiwgcGllY2VzOltcInJcIiwgXCJuXCIsIFwiYlwiXX07XHJcbiAgICAgICAgbGV0IHdoaXRlID0ge3Bhd246XCJQXCIsIHF1ZWVuOiBcIlFcIiwgcGllY2VzOltcIlJcIiwgXCJOXCIsIFwiQlwiXX07XHJcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgW2JsYWNrLCB3aGl0ZV0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXB0dXJlc1twbGF5ZXIucGF3bl0gPSA4IC0gZmVuQ2hhcnNbcGxheWVyLnBhd25dO1xyXG4gICAgICAgICAgICBpZiAoZmVuQ2hhcnNbcGxheWVyLnF1ZWVuXSA+IDEpe1xyXG4gICAgICAgICAgICAgICAgY2FwdHVyZXNbcGxheWVyLnBhd25dIC09IGZlbkNoYXJzW3BsYXllci5xdWVlbl0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChjb25zdCBwaWVjZSBvZiBwbGF5ZXIucGllY2VzKXtcclxuICAgICAgICAgICAgICAgIGlmIChmZW5DaGFyc1twaWVjZV0gPiAyKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlc1twbGF5ZXIucGF3bl0gLT0gZmVuQ2hhcnNbcGllY2VdIC0yO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYXB0dXJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkQ2hpbGQocGFyZW50OkhUTUxFbGVtZW50LCB0YWc6c3RyaW5nLCBjbGFzc05hbWU6c3RyaW5nLCB0ZXh0PzpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgICAgICBjaGlsZC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgICAgICAgaWYgKHRleHQpXHJcbiAgICAgICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgICAgICByZXR1cm4gY2hpbGQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ2hlc3Nib2FyZCBmcm9tIFwiLi4vY2hlc3Nib2FyZC9DaGVzc2JvYXJkXCI7XHJcbmltcG9ydCBTaGFyZWQgZnJvbSBcIi4uL2NoZXNzYm9hcmQvU2hhcmVkXCI7XHJcbmltcG9ydCBQaWVjZSBmcm9tIFwiLi4vY2hlc3Nib2FyZC9QaWVjZVwiO1xyXG5pbXBvcnQgQ2FzdGxpbmcgZnJvbSBcIi4vQ2FzdGxpbmdcIjtcclxuaW1wb3J0IHsgTW92ZSB9IGZyb20gXCJjaGVzcy5qc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgVHJhbnNpdGlvbkluZm8gPSB7XHJcbiAgICBpc0ZvcndhcmQ6Ym9vbGVhbjtcclxuICAgIHBpZWNlOlBpZWNlLFxyXG4gICAgbW92ZTpNb3ZlLFxyXG4gICAgY2FzdGxpbmc6Q2FzdGxpbmd8dW5kZWZpbmVkXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uc3tcclxuICAgIGNoZXNzYm9hcmQ6Q2hlc3Nib2FyZDtcclxuICAgIGlzUm90YXRlZDpib29sZWFuO1xyXG4gICAgY3VycmVudDpUcmFuc2l0aW9uSW5mb3x1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hlc3Nib2FyZDpDaGVzc2JvYXJkLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5jaGVzc2JvYXJkID0gY2hlc3Nib2FyZDtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgIH1cclxuICAgIHJvdGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gIXRoaXMuaXNSb3RhdGVkO1xyXG4gICAgfVxyXG4gICAgY2FuY2VsKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudCl7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5jdXJyZW50LnBpZWNlLmVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVHJhbnNpdGlvbihlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYXN0bGluZyA9IHRoaXMuY3VycmVudC5jYXN0bGluZztcclxuICAgICAgICAgICAgaWYgKGNhc3RsaW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlVHJhbnNpdGlvbihjYXN0bGluZy5yb29rLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBtb3ZlKHRyYW5zaXRpb246VHJhbnNpdGlvbkluZm8sIGR1cmF0aW9uOnN0cmluZywgb25UcmFuc2l0aW9uRW5kOkZ1bmN0aW9uKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQucHV0T25Ub3AodHJhbnNpdGlvbi5waWVjZSk7XHJcbiAgICAgICAgaWYgKHRyYW5zaXRpb24uY2FzdGxpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQucHV0T25Ub3AodHJhbnNpdGlvbi5jYXN0bGluZy5yb29rKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyUmVmbG93KCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdHJhbnNpdGlvbjtcclxuICAgICAgICB0cmFuc2l0aW9uLnBpZWNlLmVsZW1lbnQub250cmFuc2l0aW9uZW5kID0gKCkgPT57XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVHJhbnNpdGlvbih0cmFuc2l0aW9uLnBpZWNlLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbi5jYXN0bGluZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVRyYW5zaXRpb24odHJhbnNpdGlvbi5jYXN0bGluZy5yb29rLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgb25UcmFuc2l0aW9uRW5kKCk7XHJcbiAgICAgICAgfTsgXHJcbiAgICAgICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbi5pc0ZvcndhcmQsIGR1cmF0aW9uLCB0cmFuc2l0aW9uLnBpZWNlLmVsZW1lbnQsIHRyYW5zaXRpb24ubW92ZS5mcm9tLCB0cmFuc2l0aW9uLm1vdmUudG8pO1xyXG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmNhc3RsaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbi5pc0ZvcndhcmQsIGR1cmF0aW9uLCB0cmFuc2l0aW9uLmNhc3RsaW5nLnJvb2suZWxlbWVudCwgdHJhbnNpdGlvbi5jYXN0bGluZy5mcm9tLCB0cmFuc2l0aW9uLmNhc3RsaW5nLnRvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHRyaWdnZXJSZWZsb3coKSB7XHJcbiAgICAgICAgdm9pZChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhcnRUcmFuc2l0aW9uKGlzRm9yd2FyZDpib29sZWFuLCBkdXJhdGlvbjpzdHJpbmcsIGVsZW1lbnQ6U1ZHR0VsZW1lbnQsIGZyb206c3RyaW5nLCB0bzpzdHJpbmcpe1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IFwidHJhbnNmb3JtXCI7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgICAgICBsZXQgZGVzdCA9IGlzRm9yd2FyZCA/IHRvIDogZnJvbTtcclxuICAgICAgICBsZXQgY29yZHMgPSBTaGFyZWQuZ2V0Q29yZGluYXRlc0J5U3F1YXJlS2V5KGRlc3QsIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtjb3Jkcy54ICogMTIuNX0lLCAke2NvcmRzLnkgKiAxMi41fSUpYDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVtb3ZlVHJhbnNpdGlvbihlbGVtZW50OlNWR0dFbGVtZW50KXtcclxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IFwiXCI7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBcIlwiO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcclxuICAgICAgICBlbGVtZW50Lm9udHJhbnNpdGlvbmNhbmNlbCA9IG51bGw7XHJcbiAgICAgICAgZWxlbWVudC5vbnRyYW5zaXRpb25lbmQgPSBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFwiLi9vcGVuaW5ncy5jc3NcIjtcclxuaW1wb3J0IENoZXNzYm9hcmQgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9DaGVzc2JvYXJkXCI7XHJcbmltcG9ydCBHYW1lTmF2aWdhdG9yIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3YyL2dhbWVOYXZpZ2F0b3IvR2FtZU5hdmlnYXRvclwiO1xyXG5pbXBvcnQgQ2hlc3NnYW1lIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3YyL2NoZXNzZ2FtZS9DaGVzc2dhbWVcIjtcclxuaW1wb3J0IHsgQ2hlc3MsIE1vdmUgfSBmcm9tIFwiY2hlc3MuanNcIjtcclxuaW1wb3J0ICogYXMganNvbiBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jaGVzcy9hc3NldHMvZGF0YS9nYW1lcy5qc29uXCI7XHJcblxyXG4vLyBsZXQgYm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZXNzYm9hcmRcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbi8vIGxldCBjaGVzc2JvYXJkID0gbmV3IENoZXNzYm9hcmQoYm9hcmRDb250YWluZXIsIFwic3RhcnRcIiwgZmFsc2UpO1xyXG4vLyBsZXQgZiA9XCJyNy8zcXAxazEvMXAxcDFwUDEvcDFuUDFQMi9QblA1LzRCMy80QjMvMVEzSzIgdyAtIC0gMSAyOFwiO1xyXG4vLyBsZXQgZmVuID0gXCI4L2twUEs0LzgvOC84LzgvOC84XCI7XHJcblxyXG5sZXQgZ2FtZU5hdmlnYXRvckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZUJyb3dzZXJcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbmxldCBnYW1lTmF2aWdhdG9yID0gbmV3IEdhbWVOYXZpZ2F0b3IoZ2FtZU5hdmlnYXRvckNvbnRhaW5lciwgXCJcIiwgZmFsc2UpO1xyXG5sZXQgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcclxuLy8gY2hlc3MubG9hZFBnbihqc29uLmdhbWVzWzBdLm1vdmVUZXh0KTtcclxuY2hlc3MubG9hZFBnbihcIjEuIGU0IGY1IDIuIGV4ZjUgZzYgMy4gZnhnNiBkNSA0LiBneGg3IE5jNiA1LiBoeGc4PVEgUmc4IDYuIEJkMyBCZTYgNy4gTmYzIFFkNiA4LiBPLU8gTy1PLU9cIik7XHJcbmxldCBtb3ZlcyA9IGNoZXNzLmhpc3Rvcnkoe3ZlcmJvc2U6dHJ1ZX0pO1xyXG5nYW1lTmF2aWdhdG9yLmxvYWRHYW1lKHt3aGl0ZVBsYXllcjpcIldoaXRlIHBsYXllclwiLCBibGFja1BsYXllcjpcIkJsYWNrIHBsYXllclwiLCBtb3Zlc30pO1xyXG5cclxubGV0IHN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuc3RhcnQub25jbGljayA9ICgpID0+IHtnYW1lTmF2aWdhdG9yLmdvVG9Nb3ZlKC0xKX07XHJcblxyXG5sZXQgcmV3aW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXdpbmRcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbnJld2luZC5vbmNsaWNrID0gKCkgPT4ge2dhbWVOYXZpZ2F0b3IucmV3aW5kKCl9O1xyXG5cclxubGV0IHByZXZpb3VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2XCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5wcmV2aW91cy5vbmNsaWNrID0gKCkgPT4ge2dhbWVOYXZpZ2F0b3IucHJldmlvdXMoKX07XHJcblxyXG5sZXQgcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxucGxheS5vbmNsaWNrID0gKCkgPT4ge2dhbWVOYXZpZ2F0b3IucGxheSgpfTtcclxuXHJcbmxldCBwYXVzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2VcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbnBhdXNlLm9uY2xpY2sgPSAoKSA9PiB7Z2FtZU5hdmlnYXRvci5wYXVzZSgpfTtcclxuXHJcbmxldCBuZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXh0XCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5uZXh0Lm9uY2xpY2sgPSAoKSA9PiB7Z2FtZU5hdmlnYXRvci5uZXh0KCl9O1xyXG5cclxubGV0IGZvcndhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcndhcmRcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmZvcndhcmQub25jbGljayA9ICgpID0+IHtnYW1lTmF2aWdhdG9yLmZvcndhcmQoKX07XHJcblxyXG5sZXQgZW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmRcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmVuZC5vbmNsaWNrID0gKCkgPT4ge2dhbWVOYXZpZ2F0b3IuZ29Ub01vdmUobW92ZXMubGVuZ3RoIC0xKX07XHJcblxyXG5sZXQgcm90YXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3RhdGVcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbnJvdGF0ZS5vbmNsaWNrID0gKCkgPT4ge2dhbWVOYXZpZ2F0b3Iucm90YXRlKCl9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==