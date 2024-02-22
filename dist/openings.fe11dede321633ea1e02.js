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
}
.player.above{
    padding-top:4px;
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
    margin-top:6px;
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
}`, "",{"version":3,"sources":["webpack://./src/components/v2/gameBrowser/gameBrowser.css"],"names":[],"mappings":"AAAA;IACI,cAAc;AAClB;AACA;IACI,eAAe;AACnB;AACA;IACI,eAAe;AACnB;AACA;IACI,eAAe;AACnB;AACA;IACI,UAAU;IACV,iBAAiB;IACjB,iBAAiB;IACjB,eAAe;AACnB;AACA;IACI,UAAU;IACV,eAAe;AACnB;AACA;IACI,UAAU;IACV,eAAe;IACf,cAAc;IACd,cAAc;AAClB;AACA;IACI,eAAe;IACf,UAAU;IACV,SAAS;IACT,cAAc;IACd,YAAY;IACZ,mBAAmB;AACvB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,gBAAgB;AACpB;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,iBAAiB;IACjB,kBAAkB;AACtB;AACA;IACI,mBAAmB;IACnB,iBAAiB;IACjB,iBAAiB;AACrB","sourcesContent":[".player{\r\n    column-count:2;\r\n}\r\n.player.above{\r\n    padding-top:4px;\r\n}\r\n.player.below{\r\n    margin-top:-1px;\r\n}\r\n.player.below .captures{\r\n    margin-top:-6px;\r\n}\r\n.player .name{\r\n    clear:both;\r\n    text-align: right;\r\n    padding-right:4px;\r\n    line-height:3vh;\r\n}\r\n.player .captures{\r\n    float:left;\r\n    margin-top:-5px;\r\n}\r\n.player .score{\r\n    float:left;\r\n    margin-left:5px;\r\n    margin-top:6px;\r\n    font-size:10pt;\r\n}\r\n.player .captures svg{\r\n    position:static;\r\n    height:4vh;\r\n    width:4vh;\r\n    transform:none;\r\n    margin-top:0;\r\n    margin-bottom:-11px;\r\n}\r\n.player.white .captures span{\r\n    padding-bottom: 7px;\r\n}\r\n.player .captures .p svg:first-child{\r\n    padding-left:4px;\r\n}\r\n.player .captures .p svg{\r\n    margin-left:-8px;\r\n    margin-right:-5px;\r\n}\r\n.player .captures .n{\r\n    margin-left: 2px;\r\n    margin-right: 1px;\r\n}\r\n.player .captures .n svg{\r\n    margin-left: -6px;\r\n    margin-right: -3px;\r\n}\r\n.player .captures .b svg{\r\n    margin-left: -7px;\r\n    margin-right: -4px;\r\n}\r\n.player .captures .r svg{\r\n    margin-left: -6px;\r\n    margin-right: -5px;\r\n}\r\n.player .captures .q svg{\r\n    margin-bottom:-10px;\r\n    margin-left: -2px;\r\n    margin-right: 0px;\r\n}"],"sourceRoot":""}]);
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
        this.pieceLayer.addPiece(fenChar, squareKey);
    }
    removePiece(squareKey) {
        this.pieceLayer.removePiece(squareKey);
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
        let g = PieceFactory_1.default.get(fenChar);
        this.group.appendChild(g);
        let piece = { element: g, fenChar, squareKey };
        this.setPiecePosition(piece);
    }
    removePiece(squareKey) {
        let piece = this.positions[squareKey];
        this.group.removeChild(piece.element);
        this.positions[squareKey] = null;
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        let pieces = Object.values(this.positions);
        this.positions = {};
        pieces.forEach(piece => {
            if (piece) {
                this.setPiecePosition(piece);
            }
        });
    }
    setPiecePosition(piece) {
        let squareKey = piece.squareKey;
        this.positions[squareKey] = piece;
        let cords = Shared_1.default.getCordinatesBySquareKey(squareKey, this.isRotated);
        piece.element.setAttribute("transform", "translate(" + cords.x * 100 + "," + cords.y * 100 + ")");
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

/***/ "./src/components/v2/chessboard/PieceFactory.ts":
/*!******************************************************!*\
  !*** ./src/components/v2/chessboard/PieceFactory.ts ***!
  \******************************************************/
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
const pieceTypes = {};
["p", "n", "b", "r", "q", "k", "P", "N", "B", "R", "Q", "K"].forEach(fenChar => {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let data = pieceSVGData[fenChar.toLowerCase()];
    let color = fenChar === fenChar.toLowerCase() ? 0 : 1;
    loadChildren(g, data, color);
    pieceTypes[fenChar] = g;
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
var PieceFactory;
(function (PieceFactory) {
    function get(fenChar) {
        return pieceTypes[fenChar].cloneNode(true);
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

/***/ "./src/components/v2/gameBrowser/Animation.ts":
/*!****************************************************!*\
  !*** ./src/components/v2/gameBrowser/Animation.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shared_1 = __importDefault(__webpack_require__(/*! ../chessboard/Shared */ "./src/components/v2/chessboard/Shared.ts"));
class Animation {
    constructor(chessboard, isRotated) {
        this.chessboard = chessboard;
        this.isRotated = isRotated;
    }
    cancelAnimations() {
        clearTimeout(this.timeOutId);
    }
    move(move, onAnimationEnd) {
        let piece = this.chessboard.getPiece(move.from);
        if (piece) {
            let castlingRook;
            if (move.piece === "k" && move.san[0] === "O") {
                let rookSquare = move.color === "w" ? (move.san === "O-O" ? "h1" : "a1") : (move.san === "O-O" ? "h8" : "a8");
                castlingRook = this.chessboard.getPiece(rookSquare);
                castlingRook.element.style.transitionProperty = "transform";
                castlingRook.element.style.transitionDuration = "800ms";
            }
            piece.element.style.transitionProperty = "transform";
            piece.element.style.transitionDuration = "800ms";
            this.timeOutId = setTimeout(() => {
                if (piece) {
                    if (castlingRook) {
                        let destination = move.color === "w" ? (move.san === "O-O" ? "f1" : "d1") : (move.san === "O-O" ? "f8" : "d8");
                        let cordsTo = Shared_1.default.getCordinatesBySquareKey(destination, this.isRotated);
                        castlingRook.element.style.transform = `translate(${cordsTo.x * 12.5}%, ${cordsTo.y * 12.5}%)`;
                    }
                    let cordsTo = Shared_1.default.getCordinatesBySquareKey(move.to, this.isRotated);
                    piece.element.style.transform = `translate(${cordsTo.x * 12.5}%, ${cordsTo.y * 12.5}%)`;
                    piece.element.addEventListener('transitionend', () => {
                        if (piece) {
                            piece.element.style.transitionProperty = "";
                            piece.element.style.transform = "";
                            if (castlingRook) {
                                castlingRook.element.style.transitionProperty = "";
                                castlingRook.element.style.transform = "";
                            }
                            onAnimationEnd();
                        }
                    }, { once: true });
                }
            }, 0);
        }
    }
}
exports["default"] = Animation;


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
const PieceFactory_1 = __importDefault(__webpack_require__(/*! ../chessboard/PieceFactory */ "./src/components/v2/chessboard/PieceFactory.ts"));
const pieceTypes = {};
["p", "n", "b", "r", "q", "P", "N", "B", "R", "Q"].forEach(fenChar => {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('viewBox', '0 0 100 100');
    let piece = PieceFactory_1.default.get(fenChar);
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
const Animation_1 = __importDefault(__webpack_require__(/*! ./Animation */ "./src/components/v2/gameBrowser/Animation.ts"));
__webpack_require__(/*! ./gameBrowser.css */ "./src/components/v2/gameBrowser/gameBrowser.css");
class GameBrowser {
    constructor(container, fen, isRotated) {
        this.moves = [];
        this.currentMoveIndex = 0;
        this.chessboard = new Chessboard_1.default(container, fen, isRotated);
        this.playerInfo = new PlayerInfo_1.default(container, fen, isRotated);
        this.animation = new Animation_1.default(this.chessboard, isRotated);
        this.isRotated = isRotated;
    }
    rotate(isRotated) {
        this.playerInfo.rotate(isRotated);
        this.chessboard.rotate();
    }
    loadGame(game) {
        this.chessboard.setFen(Shared_1.default.startFEN, true);
        this.playerInfo.setPlayerNames(game.blackPlayer, game.whitePlayer);
        this.playerInfo.setScoreAndCaputereByFen(Shared_1.default.startFEN);
        this.moves = game.moves;
        this.currentMoveIndex = -1;
    }
    stepForward() {
        let move = this.moves[this.currentMoveIndex + 1];
        this.chessboard.clearSourceAndTargetHighlights();
        this.chessboard.highlightSource(move.from);
        this.animation.move(move, () => {
            //OnAnimationEnd
            if (move.captured) {
                let piece = this.chessboard.getPiece(move.to);
                this.playerInfo.addCapture(piece.fenChar);
                this.chessboard.removePiece(move.to);
            }
            let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
            this.chessboard.removePiece(move.from);
            this.chessboard.addPiece(fenChar, move.to);
            this.chessboard.highlightTarget(move.to);
        });
        this.currentMoveIndex++;
    }
    stepBack() {
        let move = this.moves[this.currentMoveIndex];
        this.currentMoveIndex--;
    }
    play() {
    }
    rewind() {
    }
    goToStart() {
    }
    goToEnd() {
    }
    goToMove(index) {
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
const pieceValues = { ["p"]: 1, ["n"]: 3, ["b"]: 3, ["r"]: 5, ["q"]: 9 };
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
        let span = isBlack ? this.blackCaptures[fenCharLowerCase] : this.whiteCaptures[fenCharLowerCase];
        span.appendChild(piece);
        let pieceValue = pieceValues[fenCharLowerCase];
        let newScore = this.score + (isBlack ? -1 * pieceValue : pieceValue);
        this.setScore(newScore);
    }
    removeCapture(color, captured) {
        let pieceValue = pieceValues[captured];
        let newScore = this.score + (color === "b" ? pieceValue : pieceValue * -1);
        this.setScore(newScore);
        return (color === "b" ? this.blackCaptures[captured].firstChild : this.whiteCaptures[captured].firstChild);
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

/***/ "./src/pages/openings/Openings.ts":
/*!****************************************!*\
  !*** ./src/pages/openings/Openings.ts ***!
  \****************************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./openings.css */ "./src/pages/openings/openings.css");
const GameBrowser_1 = __importDefault(__webpack_require__(/*! ../../components/v2/gameBrowser/GameBrowser */ "./src/components/v2/gameBrowser/GameBrowser.ts"));
const chess_js_1 = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/dist/esm/chess.js");
const json = __importStar(__webpack_require__(/*! ../../components/chess/assets/data/games.json */ "./src/components/chess/assets/data/games.json"));
// let boardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(boardContainer, "start", false);
// document.getElementById("test")!.onclick = () => chessboard.test();
// let f ="r7/3qp1k1/1p1p1pP1/p1nP1P2/PnP5/4B3/4B3/1Q3K2 w - - 1 28";
let fen = "8/kpPK4/8/8/8/8/8/8";
let browserContainer = document.getElementById("gameBrowser");
let gameBrowser = new GameBrowser_1.default(browserContainer, fen, false);
let chess = new chess_js_1.Chess();
chess.loadPgn(json.games[0].moveText);
let moves = chess.history({ verbose: true });
gameBrowser.loadGame({ whitePlayer: "White player", blackPlayer: "Black player", moves });
// let gameContainer = document.getElementById("chessgame") as HTMLElement;
// let chessgame = new Chessgame(gameContainer, "start", false);
let testButton = document.getElementById("rotate");
testButton.onclick = () => { gameBrowser.stepForward(); };
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

/***/ "./src/components/chess/assets/data/games.json":
/*!*****************************************************!*\
  !*** ./src/components/chess/assets/data/games.json ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"games":[{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"30","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"2560","BlackElo":"2785","ECO":"E83"},"moveText":"1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 Nc6 7.Nge2 a6 8.h4 h5 9.Nc1 Nd7 10.Nb3 a5 11.a4 Nb4 12.Be2 b6 13.g4 hxg4 14.fxg4 c5 15.h5 cxd4 16.Nxd4 Nc5 17.Nd5 Bb7 18.Nf5 gxf5 19.gxf5 Bxd5 20.exd5 Bxb2 21.Kf1 Qd7 22.Qb1 Bxa1 23.Rg1+ Kh8 24.Qxa1+ f6 25.Qb1 Rg8 26.Rg6 Rxg6 27.hxg6 Kg7  0-1 "},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"29","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2560","ECO":"C95"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5 17.dxe5 Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6 23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5 hxg5 29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5 35.Ra7 g6 36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6 Nf2 42.g4 Bd3 43.Re6 Kd5 44.Rb6 Kc5 45.Re6  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"28","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"E83"},"moveText":"1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 Nc6 7.Nge2 a6 8.h4 h5 9.Nc1 e5 10.d5 Nd4 11.Nb3 Nxb3 12.Qxb3 Kh7 13.Be2 Bh6 14.Bxh6 Kxh6 15.O-O-O Kg7 16.Kb1 Qe7 17.Rdg1 Rh8 18.g4 hxg4 19.fxg4 Nd7 20.g5 Nc5 21.Qd1 a5 22.Rf1 Bd7 23.Qe1 Rh7 24.Qg3 Rf8 25.Rf6 Rfh8 26.b3 Be8 27.Bg4 Bd7 28.Bd1 Be8 29.Bg4 Bd7 30.Bd1 Be8 31.Rf2 c6 32.a4 Qd8 33.Ka2 Qe7 34.Bg4 Bd7 35.Bd1 Be8  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"27","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2560","ECO":"C69"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O f6 6.d4 exd4 7.Nxd4 c5 8.Ne2 Qxd1 9.Rxd1 Bd7 10.Nbc3 Ne7 11.Bf4 O-O-O 12.Rd2 Ng6 13.Bg3 Ne5 14.Bxe5 fxe5 15.Rad1 c4 16.Kf1 Bc5 17.Ng1 Bg4 18.Rxd8+ Rxd8 19.Rxd8+ Kxd8 20.Nce2 Ke7 21.Ke1 b5 22.c3 Kf6 23.h3 Bh5 24.Ng3 Bf7 25.Nf3 g6 26.Nf1 g5 27.Ke2 Bg6 28.N3d2 h5 29.Ne3 c6 30.Kf3 Bf7 31.Ndf1 a5 32.Ke2 Be6 33.Ng3 Kg6 34.a3 Bf7 35.Ngf5 Be6 36.Kf3 Bd7 37.Kg3 Be6 38.h4 Bd7 39.hxg5 Kxg5 40.Nh4 Bg4 41.Nxg4 hxg4 42.Nf5 a4 43.f3 gxf3 44.Kxf3 Bf8 45.Ne3 Kh5 46.Nf5 Bc5  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"26","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1-0","WhiteElo":"2560","BlackElo":"2785","ECO":"E90"},"moveText":"1.d4 Nf6 2.c4 c5 3.d5 d6 4.Nc3 g6 5.e4 Bg7 6.Bd3 O-O 7.Nf3 Bg4 8.h3 Bxf3 9.Qxf3 Nbd7 10.Qd1 e6 11.O-O exd5 12.exd5 Ne8 13.Bd2 Ne5 14.Be2 f5 15.f4 Nf7 16.g4 Nh6 17.Kg2 Nc7 18.g5 Nf7 19.Rb1 Re8 20.Bd3 Rb8 21.h4 a6 22.Qc2 b5 23.b3 Rb7 24.Rbe1 Rxe1 25.Rxe1 Qb8 26.Bc1 Qd8 27.Ne2 bxc4 28.bxc4 Ne8 29.h5 Re7 30.h6 Bh8 31.Bd2 Rb7 32.Rb1 Qb8 33.Ng3 Rxb1 34.Qxb1 Qxb1 35.Bxb1 Bb2 36.Kf3 Kf8 37.Ke2 Nh8 38.Kd1 Ke7 39.Kc2 Bd4 40.Kb3 Bf2 41.Nh1 Bh4 42.Ka4 Nc7 43.Ka5 Kd7 44.Kb6 Kc8 45.Bc2 Nf7 46.Ba4 Kb8 47.Bd7 Nd8 48.Bc3 Na8+ 49.Kxa6 Nc7+ 50.Kb6 Na8+ 51.Ka5 Kb7 52.Kb5 Nc7+ 53.Ka4 Na8 54.Kb3 Kc7 55.Be8 Kc8 56.Bf6 Nc7 57.Bxg6 hxg6 58.Bxd8  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"25","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2560","ECO":"B80"},"moveText":"1.e4 c5 2.Nc3 Nc6 3.Nge2 d6 4.d4 cxd4 5.Nxd4 e6 6.Be3 Nf6 7.Qd2 Be7 8.f3 a6 9.O-O-O O-O 10.g4 Nxd4 11.Bxd4 b5 12.g5 Nd7 13.h4 b4 14.Na4 Bb7 15.Nb6 Rb8 16.Nxd7 Qxd7 17.Kb1 Qc7 18.Bd3 Bc8 19.h5 e5 20.Be3 Be6 21.Rdg1 a5 22.g6 Bf6 23.gxh7+ Kh8 24.Bg5 Qe7 25.Rg3 Bxg5 26.Rxg5 Qf6 27.Rhg1 Qxf3 28.Rxg7 Qf6 29.h6 a4 30.b3 axb3 31.axb3 Rfd8 32.Qg2 Rf8 33.Rg8+ Kxh7 34.Rg7+ Kh8 35.h7  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"24","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"B23"},"moveText":"1.e4 c5 2.Ne2 Nf6 3.Nbc3 d6 4.g3 g6 5.Bg2 Nc6 6.O-O Bg7 7.d4 cxd4 8.Nxd4 Bg4 9.Nde2 Qc8 10.f3 Bh3 11.Bxh3 Qxh3 12.Bg5 O-O 13.Qd2 h6 14.Be3 Kh7 15.Rac1 Qd7 16.Nd5 Nxd5 17.exd5 Ne5 18.b3 b5 19.Bd4 Rac8 20.f4 Ng4 21.Bxg7 Kxg7 22.Nd4 Nf6 23.c4 bxc4 24.bxc4 e6 25.dxe6 fxe6 26.Rfe1 Rfe8 27.Nb3 a6 28.Qd4 Rc6 29.Red1 e5 30.fxe5 Rxe5 31.Qxe5 dxe5 32.Rxd7+ Nxd7 33.Rd1 Nf6 34.c5 Kf7 35.Rc1 Nd7 36.Kf2 Ke6 37.Ke3 Kd5 38.Rd1+ Ke6 39.Rc1 Kd5  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"23","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2560","ECO":"B23"},"moveText":"1.e4 c5 2.Nc3 e6 3.Nge2 Nc6 4.g3 d5 5.exd5 exd5 6.d3 Nf6 7.Bg2 Be7 8.Bg5 d4 9.Bxf6 Bxf6 10.Ne4 Be7 11.Nf4 O-O 12.O-O Re8 13.Qh5 g6 14.Qd5 Bf5 15.Rfe1 Kg7 16.a3 Rc8 17.h3 Qxd5 18.Nxd5 Bf8 19.g4 Be6 20.Nef6 Red8 21.g5 Bd6 22.Re4 Ne7 23.Rh4 Rh8 24.Re1 Nf5 25.Rhe4 h6 26.h4 hxg5 27.hxg5 Rh4 28.Rxh4 Nxh4 29.Re4 Nf5 30.Nf4 Ba2 31.N4d5 Bxd5 32.Nxd5 Kf8 33.Kf1 Re8 34.Rxe8+ Kxe8 35.Nf6+ Kd8 36.Bxb7 Bf4 37.Ne4 Bc1 38.a4 Bxb2 39.Nxc5 Bc1 40.Be4 Bxg5 41.Bxf5 gxf5 42.Nb3 Bf6 43.Kg2 Kd7 44.Kg3 Ke6 45.Na5 Be5+ 46.Kh4 Bf6+ 47.Kh5 Kd5 48.Kh6 Kc5 49.Kh7 Kb4 50.Nc6+ Kc3 51.Kg8 Kxc2 52.Kxf7 Bh8 53.a5 Kxd3 54.a6 Ke2 55.Nxa7 d3 56.Nc6 d2 57.a7 d1=Q 58.a8=Q Qd5+ 59.Kg6 Qe6+ 60.Kh7 Bc3 61.Nd8 Qe7+ 62.Kg6 Qf6+ 63.Kh5 Qh8+ 64.Kg6 Qg7+ 65.Kxf5 Qf6+ 66.Kg4 Qg6+ 67.Kf4 Bd2+ 68.Ke5 Bc3+ 69.Kf4 Qd6+ 70.Kf5 Qd7+ 71.Kg5 Qe7+ 72.Kf5 Qf6+ 73.Kg4 Qg7+ 74.Kf5 Qf6+ 75.Kg4 Qg6+ 76.Kf4 Bd2+ 77.Ke5 Qg5+ 78.Ke6 Qg4+ 79.Kf7 Qd7+ 80.Kg6  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"22","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"B25"},"moveText":"1.e4 c5 2.Ne2 Nf6 3.Nbc3 d6 4.g3 Nc6 5.Bg2 g6 6.O-O Bg7 7.d3 O-O 8.h3 Rb8 9.f4 Bd7 10.Be3 b5 11.a3 Ne8 12.d4 cxd4 13.Nxd4 b4 14.Nxc6 Bxc6 15.axb4 Rxb4 16.Rxa7 Rxb2 17.e5 Bxg2 18.Kxg2 Nc7 19.exd6 exd6 20.Na4 Ra2 21.Bb6 Qe8 22.Rxc7 Qxa4 23.Qxd6 Rxc2+ 24.Rxc2 Qxc2+ 25.Bf2 Qe4+ 26.Kg1  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"21","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2560","ECO":"B44"},"moveText":"1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 e6 5.Nb5 d6 6.c4 Nf6 7.N5c3 Be7 8.g3 O-O 9.Bg2 a6 10.O-O Rb8 11.Na3 Qc7 12.Be3 Bd7 13.Rc1 Ne5 14.h3 Rfc8 15.f4 Ng6 16.Qd2 Be8 17.Rfd1 b6 18.Qf2 h6 19.Kh2 Qa7 20.Qe2 Qc7 21.Bf3 Bc6 22.Nab1 Qb7 23.Nd2 b5 24.cxb5 axb5 25.b4 Qa8 26.Rc2 d5 27.e5 Ne4 28.Bxe4 dxe4 29.Bc5 Bxc5 30.bxc5 Rd8 31.Re1 Ne7 32.Ncxe4 Nf5 33.Nb3 Nd4 34.Nxd4 Rxd4 35.Nd6 Qa4 36.f5 Ra8 37.Rb2 Qa3 38.fxe6 fxe6 39.Nxb5 Bxb5 40.Qxb5 Rd3 41.Rg2 Qc3 42.Ree2 Ra3 43.Rc2 Qxe5 44.Rce2 Re3 45.Rxe3 Rxe3 46.a4 Rc3 47.c6 Qd6 48.c7 Rxc7 49.Qb8+ Kh7 50.a5 h5 51.h4 Qc5 52.a6 Rf7 53.Qb1+ Kh6 54.Qa2 Re7 55.Qd2+ Kg6 56.Re2 Kh7 57.Qc2+ Qxc2 58.Rxc2 Kg6 59.Ra2 Ra7 60.Ra5 e5 61.Kg2 Kf5 62.Kf2 Ke6 63.Ke3 Kf5 64.Kf3 g6 65.Ra3 g5 66.hxg5 Kxg5 67.Ke4  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"20","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1-0","WhiteElo":"2560","BlackElo":"2785","ECO":"B24"},"moveText":"1.e4 c5 2.Ne2 Nf6 3.Nbc3 e6 4.g3 Nc6 5.Bg2 Be7 6.O-O d6 7.d3 a6 8.a3 Qc7 9.f4 b5 10.Kh1 O-O 11.Be3 Bb7 12.Bg1 Rab8 13.h3 Ba8 14.g4 b4 15.axb4 cxb4 16.Na4 Nd7 17.Qd2 Rfc8 18.b3 a5 19.g5 Bf8 20.Ra2 Ne7 21.Nd4 g6 22.Nb2 Bg7 23.Nc4 d5 24.Nxa5 dxe4 25.dxe4 e5 26.Ne2 exf4 27.Nxf4 Ne5 28.Nd3 Rb5 29.Nxe5 Qxe5 30.Nc4 Qxg5 31.Be3 Qh4 32.Nd6 Bc3 33.Qf2 Qxf2 34.Rxf2 Rbb8 35.Nxc8 Rxc8 36.Ra7 Kf8 37.Bh6+ Ke8 38.Bg5 f6 39.Bxf6 Bxf6 40.Rxf6 Bc6 41.Kg1 Bd7 42.Rd6 Bc6 43.Bf1  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"19","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2560","ECO":"B23"},"moveText":"1.e4 c5 2.Nc3 Nc6 3.Nge2 e5 4.Nd5 Nge7 5.Nec3 Nxd5 6.Nxd5 Be7 7.g3 d6 8.Bg2 h5 9.h4 Be6 10.d3 Bxd5 11.exd5 Nb8 12.f4 Nd7 13.O-O g6 14.Rb1 f5 15.b4 b6 16.bxc5 bxc5 17.c4 O-O 18.Qa4 Bf6 19.Rb7 Nb6 20.Qb5 Rf7 21.Rxf7 Kxf7 22.Bd2 Rb8 23.Qc6 Nc8 24.Re1 Ne7 25.Qa4 Qc7 26.Kh2 exf4 27.Bxf4 Be5 28.Re2 Rb6 29.Kh3 Ng8 30.Rxe5 dxe5 31.Bxe5 Qe7 32.d6 Rxd6 33.Bxd6 Qxd6 34.Bd5+ Kf8 35.Qxa7 Ne7 36.Qa8+ Kg7 37.Qb7 Kf8 38.a4 f4 39.a5 fxg3 40.a6 Qf4 41.Bf3 Nf5 42.Qe4 g2 43.Qxf4 g1=Q 44.Be4 Qa1 45.a7 Qxa7 46.Bxf5 gxf5 47.Qxf5+ Kg7 48.Qg5+ Kf8 49.Qh6+ Kg8 50.Qxh5 Qc7 51.Qg6+ Kh8 52.Qf6+ Kg8 53.Qe6+ Kh8 54.Qd5 Qf7 55.Kg2 Qg6+ 56.Kh3 Qf7 57.Qe5+ Kh7 58.Kg4 Qg6+ 59.Kf4 Qh6+ 60.Kf3 Qg6 61.Qe4 Kh8 62.Ke2 Qd6 63.Qe3 Qh2+ 64.Ke1 Qh1+ 65.Kd2 Qh2+ 66.Kc3 Qxh4 67.d4 Kh7 68.d5 Qf6+ 69.Kc2 Qd6 70.Qg5 Kh8 71.Kd2 Qb6 72.Qe5+ Kg8 73.Qe8+ Kg7 74.Qb5 Qc7 75.Kc2 Kf8 76.Qa6 Qh2+ 77.Kb3 Qb8+ 78.Qb5 Qc7 79.Ka3 Qa7+ 80.Kb3 Ke7 81.Kc2 Kd8 82.Kd2 Qc7 83.Qa6 Qf4+ 84.Kc2 Qe4+  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"18","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"D27"},"moveText":"1.d4 d5 2.c4 dxc4 3.Nf3 e6 4.e3 Nf6 5.Bxc4 a6 6.O-O c5 7.dxc5 Qxd1 8.Rxd1 Bxc5 9.Nbd2 O-O 10.a3 b5 11.Be2 Bb7 12.b4 Be7 13.Bb2 Nbd7 14.Rac1 Rfc8 15.Nb3 Rxc1 16.Rxc1 Rc8 17.Rxc8+ Bxc8 18.Nfd4 Nb8 19.Bf3 Kf8 20.Na5 Bd6 21.Ndb3 e5 22.Nc5 Ke7 23.h3 Nfd7 24.Nd3 f6 25.Be4 g6 26.f4 exf4 27.exf4 Nb6 28.Nb7 Bc7 29.Nbc5 Nc4 30.Bc1 Nd7 31.Kf1 Nxc5 32.Nxc5 Bb6 33.Bd3 Bxc5 34.bxc5 Be6 35.Kf2 Kd7 36.Bxc4 Bxc4  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"17","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2560","ECO":"B23"},"moveText":"1.e4 c5 2.Nc3 Nc6 3.Nge2 e6 4.g3 d5 5.exd5 exd5 6.Bg2 d4 7.Nd5 Nf6 8.Nef4 Nxd5 9.Nxd5 Bd6 10.O-O O-O 11.d3 Be6 12.Nf4 Bf5 13.h3 Rb8 14.Bd2 Re8 15.Re1 Rxe1+ 16.Qxe1 Qd7 17.g4 Re8 18.Qd1 Bxf4 19.Bxf4 Be6 20.Qf3 Nb4 21.Qxb7 Qxb7 22.Bxb7 Nxc2 23.Rc1 Nb4 24.Be4 Bxa2 25.Bd2 Bd5 26.Bxd5 Nxd5 27.Rxc5 Nb6 28.Kf1 f6 29.Ra5 Re7 30.Bb4 Rd7 31.Bc5 Kf7 32.Ke2 g5 33.Kf3 Kg6 34.Ke4 h5 35.Bxd4 Re7+ 36.Kf3 h4 37.Bc5 Re1 38.Rxa7 Nd5 39.Bf8 Re8 40.Bd6 Re6 41.Rd7 Nb6 42.Rd8 Nd5 43.b4 Re1 44.b5 Rb1 45.Rb8 Rb3 46.Ke4 Nc3+ 47.Kd4 Nxb5+ 48.Kc4 Rc3+ 49.Kxb5 Rxd3 50.Kc6 Rxh3 51.Kd5 Rf3 52.Ke6 Rxf2 53.Rg8+ Kh7 54.Kf7 Ra2 55.Rg7+ Kh6 56.Bf8 Ra7+ 57.Kxf6 Ra6+ 58.Kf7  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"16","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"2560","BlackElo":"2785","ECO":"E70"},"moveText":"1.d4 Nf6 2.c4 c5 3.d5 d6 4.Nc3 g6 5.e4 Bg7 6.Bg5 h6 7.Bh4 g5 8.Bg3 Qa5 9.Bd3 Nxe4 10.Bxe4 Bxc3+ 11.bxc3 Qxc3+ 12.Kf1 f5 13.Rc1 Qf6 14.h4 g4 15.Bd3 f4 16.Ne2 fxg3 17.Nxg3 Rf8 18.Rc2 Nd7 19.Qxg4 Ne5 20.Qe4 Bd7 21.Kg1 O-O-O 22.Bf1 Rg8 23.f4 Nxc4 24.Nh5 Qf7 25.Qxc4 Qxh5 26.Rb2 Rg3 27.Be2 Qf7 28.Bf3 Rdg8 29.Qb3 b6 30.Qe3 Qf6 31.Re2 Bb5 32.Rd2 e5 33.dxe6 Bc6 34.Kf1 Bxf3  0-1"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"15","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2560","ECO":"E07"},"moveText":"1.c4 e6 2.Nf3 Nf6 3.g3 d5 4.Bg2 Be7 5.O-O O-O 6.d4 Nbd7 7.Nbd2 b6 8.cxd5 exd5 9.Ne5 Bb7 10.Ndf3 Ne4 11.Bf4 Ndf6 12.Rc1 c5 13.dxc5 bxc5 14.Ng5 Nxg5 15.Bxg5 Ne4 16.Bxe7 Qxe7 17.Bxe4 dxe4 18.Nc4 e3 19.f3 Rad8 20.Qb3 Rfe8 21.Rc3 Bd5 22.Rfc1 g6 23.Qa3 Bxf3 24.exf3 e2 25.Re1 Rd1 26.Kf2 Rxe1 27.Kxe1 Qd7 28.Qb3 Qh3 29.Ne3 Qxh2 30.g4 Rb8 31.Qd5 Rxb2 32.Qd8+ Kg7 33.Nf5+ gxf5  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"14","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"D27"},"moveText":"1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.dxc5 Qxd1 8.Rxd1 Bxc5 9.b3 b5 10.Be2 Bb7 11.Bb2 Nbd7 12.Nbd2 O-O 13.Rac1 Rfc8 14.h3 Kf8 15.Kf1 Ke7 16.Ne1 Bd6 17.a4 Bc6 18.axb5 axb5 19.Rc2 Rc7 20.Rdc1 Rac8 21.Bf3 Bxf3 22.Ndxf3 e5 23.Rxc7 Rxc7 24.Rxc7 Bxc7 25.Nc2 Ne4 26.Na3 b4 27.Nc4 f6 28.Ne1 Ndc5 29.Nc2 Nxb3 30.Nxb4 Nbd2+ 31.Nxd2 Nxd2+ 32.Ke2 Nc4  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"13","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2560","ECO":"B31"},"moveText":"1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.Bxc6 bxc6 5.O-O Bg7 6.Re1 f6 7.c3 Nh6 8.d4 cxd4 9.cxd4 O-O 10.Nc3 d6 11.Qa4 Qb6 12.Nd2 Nf7 13.Nc4 Qa6 14.Be3 Qxa4 15.Nxa4 f5 16.exf5 Bxf5 17.Rac1 Rfc8 18.Na5 Bd7 19.b3 Rab8 20.Nc3 Kf8 21.a3 Nh6 22.b4 Nf5 23.Red1 Ke8 24.Ne4 Rb5 25.h3 h5 26.Rd2 a6 27.Kf1 Rd5 28.Rcd1 Rb5 29.Ke2 Be6 30.Rc1 Kd7 31.Nc3 Rbb8 32.Kf1 h4 33.Ke2 Bf6 34.Ne4 Bd5 35.Kd3 Bg7 36.Rdc2 Rc7 37.Re1 Rf8 38.f3 Rb8 39.Nc3 Bg8 40.Ne2 Bf7 41.Bd2 Bf6 42.Rec1 Rbc8 43.Nc4 Rb7 44.Na5 Rbc7 45.Nc4 Rb7  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"12","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1-0","WhiteElo":"2560","BlackElo":"2785","ECO":"E83"},"moveText":"1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 Nc6 7.Nge2 a6 8.h4 h5 9.Nc1 e5 10.d5 Ne7 11.Be2 Nh7 12.Nd3 f5 13.a4 Nf6 14.Nf2 a5 15.Qc2 c5 16.O-O-O b6 17.Rdg1 Nh7 18.Nb5 Kh8 19.g4 hxg4 20.fxg4 f4 21.Bd2 g5 22.hxg5 Ng6 23.Rh5 Rf7 24.Rgh1 Bf8 25.Qb3 Rb8 26.Qh3 Rbb7 27.Nd3 Kg8 28.Ne1 Rg7 29.Nf3 Rbf7 30.Rh6 Qd7 31.Qh5 Qxg4 32.Rxg6 Qxh5 33.Rxg7+ Rxg7 34.Rxh5 Bg4 35.Rh4 Bxf3 36.Bxf3 Nxg5 37.Bg4 Rh7 38.Rxh7 Kxh7 39.Kc2 Be7 40.Kd3 Kg6 41.Nc7 Kf7 42.Ne6 Nh7 43.Bh5+ Kg8 44.Be1 Nf6 45.Bh4 Kh7 46.Bf7 Nxd5 47.cxd5 Bxh4 48.Bh5 Kh6 49.Be2 Bf2 50.Kc4 Bd4 51.b3 Kg6 52.Kb5 Kf6 53.Kc6 Ke7 54.Ng7  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"11","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2560","ECO":"B31"},"moveText":"1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.Bxc6 bxc6 5.O-O Bg7 6.Re1 e5 7.b4 cxb4 8.a3 c5 9.axb4 cxb4 10.d4 exd4 11.Bb2 d6 12.Nxd4 Qd7 13.Nd2 Bb7 14.Nc4 Nh6 15.Nf5 Bxb2 16.Ncxd6+ Kf8 17.Nxh6 f6 18.Ndf7 Qxd1 19.Raxd1 Ke7 20.Nxh8 Rxh8 21.Nf5+ gxf5 22.exf5+ Be5 23.f4 Rc8 24.fxe5 Rxc2 25.e6 Bc6 26.Rc1 Rxc1 27.Rxc1 Kd6 28.Rd1+ Ke5 29.e7 a5 30.Rc1 Bd7 31.Rc5+ Kd4 32.Rxa5 b3 33.Ra7 Be8 34.Rb7 Kc3 35.Kf2 b2 36.Ke3 Bf7 37.g4 Kc2 38.Kd4 b1=Q 39.Rxb1 Kxb1 40.Kc5 Kc2 41.Kd6  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"10","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"E35"},"moveText":"1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 d5 5.cxd5 exd5 6.Bg5 h6 7.Bh4 c5 8.dxc5 Nc6 9.e3 g5 10.Bg3 Qa5 11.Nf3 Ne4 12.Nd2 Nxc3 13.bxc3 Bxc3 14.Rb1 Qxc5 15.Rb5 Qa3 16.Rb3 Bxd2+ 17.Qxd2 Qa5 18.Bb5 Qxd2+ 19.Kxd2 Bd7 20.Bxc6 Bxc6 21.h4 Ke7 22.Be5 f6 23.Bd4 g4 24.Rc1 Ke6 25.Rb4 h5 26.Rc3 Rhc8 27.a4 b6 28.Kc2 Be8 29.Kb2 Rxc3 30.Bxc3 Rc8 31.e4 Bc6 32.exd5+ Bxd5 33.g3 Bc4 34.Bd4 Kd5 35.Be3 Rc7 36.Kc3 f5 37.Kb2 Ke6 38.Kc3 Bd5+ 39.Kb2 Be4 40.a5 bxa5 41.Rb5 a4 42.Rc5 Rb7+ 43.Ka3 a6 44.Kxa4 Bd5 45.Ka5 Ke5 46.Kxa6 Rb3 47.Rc7 Ke4 48.Rh7 Rxe3 49.fxe3 Kxe3 50.Rxh5 Be4 51.Rh8 Kf3 52.Re8 Kxg3 53.h5 Bd3+ 54.Kb6 f4 55.Kc5 f3 56.Kd4 Bf5 57.Rf8 Kf4 58.h6 g3 59.h7 g2 60.h8=Q g1=Q+ 61.Kc4 Qc1+ 62.Kb3 Qc2+ 63.Kb4 Qe4+ 64.Kc3 Qc6+ 65.Kb3 Qd5+ 66.Kc3 Qc5+ 67.Kb2 Qb4+ 68.Ka2  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"9","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2560","ECO":"C69"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O f6 6.d4 exd4 7.Nxd4 c5 8.Nb3 Qxd1 9.Rxd1 Bg4 10.f3 Be6 11.Nc3 Bd6 12.Be3 b6 13.a4 O-O-O 14.a5 Kb7 15.e5 Be7 16.Rxd8 Bxd8 17.Ne4 Kc6 18.axb6 cxb6 19.Nbxc5 Bc8 20.Nxa6 fxe5 21.Nb4+  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"8","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"2560","BlackElo":"2785","ECO":"E84"},"moveText":"1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 Nc6 7.Nge2 a6 8.Qd2 Rb8 9.h4 h5 10.Bh6 e5 11.Bxg7 Kxg7 12.d5 Ne7 13.Ng3 c6 14.dxc6 Nxc6 15.O-O-O Be6 16.Kb1 Ne8 17.Nd5 b5 18.Ne3 Rh8 19.Rc1 Qb6 20.Bd3 Nd4 21.Nd5 Qa7 22.Nf1 Nf6 23.Nfe3 Bxd5 24.cxd5 Rbc8 25.Rcf1 Qe7 26.g4 Nd7 27.g5 Kf8 28.Rf2 Ke8 29.Bf1 Nc5 30.Bh3 Rc7 31.Rc1 Ncb3 32.axb3 Nxb3 33.Rc6 Nxd2+ 34.Rxd2 Kf8 35.Rxa6 Ra7 36.Rc6 Kg7 37.Bf1 Ra1+ 38.Kxa1 Qa7+ 39.Kb1 Qxe3 40.Kc2 b4  0-1"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"7","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2560","ECO":"C92"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.d3 Na5 10.Bc2 c5 11.Nbd2 Re8 12.h3 Bf8 13.Nf1 Bb7 14.Ng3 g6 15.Bg5 h6 16.Bd2 d5 17.exd5 c4 18.b4 cxd3 19.Bxd3 Qxd5 20.Be4 Nxe4 21.Nxe4 Bg7 22.bxa5 f5 23.Ng3 e4 24.Nh4 Bf6 25.Nxg6 e3 26.Nf4 Qxd2 27.Rxe3 Qxd1+ 28.Rxd1 Rxe3 29.fxe3 Rd8 30.Rxd8+ Bxd8 31.Nxf5 Bxa5 32.Nd5 Kf8 33.e4 Bxd5 34.exd5 h5 35.Kf2 Bxc3 36.Ke3 Kf7 37.Kd3 Bb2 38.g4 hxg4 39.hxg4 Kf6 40.d6 Ke6 41.g5 a5 42.g6 Bf6 43.g7 Kf7 44.d7  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"6","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"D27"},"moveText":"1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.dxc5 Qxd1 8.Rxd1 Bxc5 9.b3 Nbd7 10.Bb2 b5 11.Be2 Bb7 12.Nbd2 Ke7 13.a4 bxa4 14.Rxa4 Rhb8 15.Rc1 Bd5 16.Ne5 Bd6 17.Nxd7 Nxd7 18.Rxa6 Rxa6 19.Bxa6 f6 20.Bc4 Bxc4 21.Rxc4 Nc5 22.Rc3 f5 23.Ba3 Ne4 24.Rc7+ Kd8 25.Bxd6 Nxd2 26.Rxg7 Rxb3 27.h4 h5 28.Bf4 Ke8 29.Kh2 Rb2 30.Kh3 Ne4 31.f3 Nf2+ 32.Kg3 Nd3 33.Bg5 e5 34.Kh3 Nf2+ 35.Kh2 Nd3 36.Bh6 Ne1 37.Kg1 Nd3 38.Bg5 Rb1+ 39.Kh2 Rb2 40.Re7+ Kf8 41.Re6 Kg7 42.Kh3 Re2 43.Rd6 Ne1 44.Bf6+ Kg8 45.Bxe5 Rxe3 46.Bf4 Re2 47.Rg6+ Kf7 48.Rg5 Ke6 49.Bc7 Ra2 50.Bb6 Nd3 51.Kh2 Ne1 52.Kh3 Nd3 53.Bc7 Rc2 54.Bb6 Ra2 55.Kg3 Ne1 56.Rxh5 Rxg2+ 57.Kf4 Nd3+ 58.Ke3 Ne5 59.Rh6+ Kd5 60.Bc7 Rg7 61.Bxe5 Kxe5  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"5","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"0-1","WhiteElo":"2785","BlackElo":"2560","ECO":"C95"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.Bg5 h6 16.Bd2 exd4 17.cxd4 c5 18.d5 Nb6 19.Ba5 Nfd7 20.b3 Bg7 21.Rc1 Qf6 22.Rb1 b4 23.Ne2 Qe7 24.a3 bxa3 25.Bc3 f5 26.Bxg7 Qxg7 27.Nf4 fxe4 28.Nh4 g5 29.Ne6 Qf6 30.Qg4 Nxd5 31.Nxg5 hxg5 32.Qxd7 Nb4 33.Qxb7 Nxc2 34.Rxe4 a2 35.Rf1 Nb4 36.Rg4 a1=Q 37.Rxa1 Qxa1+ 38.Kh2 Qg7 39.Qf3 Qe5+ 40.g3 Rf8 41.Qg2 Qf6 42.f4 Ra7 43.Rxg5+ Rg7 44.Rh5 Qe6 45.g4 Rxf4  0-1"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"4","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1-0","WhiteElo":"2560","BlackElo":"2785","ECO":"D27"},"moveText":"1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.dxc5 Qxd1 8.Rxd1 Bxc5 9.b3 Nbd7 10.Bb2 b6 11.Nc3 Bb7 12.Rac1 Be7 13.Nd4 Rc8 14.f3 b5 15.Be2 Bc5 16.Kf1 Ke7 17.e4 g5 18.Nb1 g4 19.Ba3 b4 20.Rxc5 Nxc5 21.Bxb4 Rhd8 22.Na3 gxf3 23.gxf3 Nd7 24.Nc4 Ba8 25.Kf2 Rg8 26.h4 Rc7 27.Nc2 Rb8 28.Ba3 h5 29.Rg1 Kf6 30.Ke3 a5 31.Rg5 a4 32.b4 Nb7 33.b5 Nbc5 34.Nd4 e5 35.Nxe5 Nxe5 36.Rf5+ Kg7 37.Rxe5 Nxe4 38.Bd3 Rc3 39.Bb4 Rxd3+ 40.Kxd3 Nf6 41.Bd6 Rc8 42.Rg5+ Kh7 43.Be5 Ne8 44.Rxh5+ Kg6 45.Rg5+ Kh7 46.Bf4 f6 47.Rf5 Kg6 48.b6 Rd8 49.Ra5 Bxf3 50.h5+  1-0"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"3","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2560","ECO":"C95"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.Bg5 h6 16.Bd2 exd4 17.cxd4 c5 18.Bf4 cxd4 19.Nxd4 Ne5 20.b3 d5 21.Qd2 dxe4 22.Nxe4 Nd5 23.Bg3 Rc8 24.Re2 f5 25.Bxe5 Rxe5 26.Ng3 Rxe2 27.Ngxe2 Nb4 28.Rd1 Nxc2 29.Nxc2 Qxd2 30.Rxd2 Rc7 31.Ne3 Kf7 32.h4 Bc8 33.Nf4 g5 34.hxg5 hxg5 35.Nd3 Bg7 36.Nd5 Rc6 37.N5b4 Rc7 38.Nd5 Rc6 39.N5b4 Rc7  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"2","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2560","BlackElo":"2785","ECO":"E80"},"moveText":"1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 c5 6.dxc5 dxc5 7.Qxd8+ Kxd8 8.Be3 Nfd7 9.Nge2 b6 10.O-O-O Na6 11.g3 Nc7 12.f4 e6 13.Bh3 Ke7 14.Rhf1 h6 15.e5 Bb7 16.g4 Rad8 17.Ng3 f6 18.Nce4 fxe5 19.f5 Bxe4 20.Nxe4 gxf5 21.gxf5 Nf6 22.Rg1 Rxd1+ 23.Kxd1 Bf8 24.Nxf6 Kxf6 25.Rf1 exf5 26.Rxf5+ Kg7 27.Rxe5 Bd6 28.Re4 Bxh2 29.Ke2 h5 30.Re7+ Kf6 31.Rd7 Be5 32.b3 h4 33.Kf3 Rg8 34.Bg4 h3 35.Rh7 h2 36.Bf4 Rf8 37.Bxe5+ Kg6+ 38.Ke4 Kxh7 39.Bxh2 Re8+ 40.Kf5 Ne6 41.Kf6 Nd4 42.Bd6 Re4 43.Bd7 Re2 44.a4 Rb2 45.Bb8 a5 46.Ba7 Rxb3 47.Ke5 Nf3+ 48.Kd6 Nd2 49.Be6 Rb4 50.Kc6 Nb3 51.Bd5 Rxa4 52.Bxb6 Ra1 53.Bxc5 a4 54.Bb4 a3 55.c5 Nd4+ 56.Kd7 Rd1 57.Bxa3 Nc2 58.c6 Rxd5+ 59.Bd6  1/2-1/2"},{"tags":{"Event":"St Stefan/Belgrade m","Site":"Belgrade","Date":"1992.??.??","Round":"1","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2560","ECO":"C95"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.Bg5 h6 16.Bd2 Bg7 17.a4 c5 18.d5 c4 19.b4 Nh7 20.Be3 h5 21.Qd2 Rf8 22.Ra3 Ndf6 23.Rea1 Qd7 24.R1a2 Rfc8 25.Qc1 Bf8 26.Qa1 Qe8 27.Nf1 Be7 28.N1d2 Kg7 29.Nb1 Nxe4 30.Bxe4 f5 31.Bc2 Bxd5 32.axb5 axb5 33.Ra7 Kf6 34.Nbd2 Rxa7 35.Rxa7 Ra8 36.g4 hxg4 37.hxg4 Rxa7 38.Qxa7 f4 39.Bxf4 exf4 40.Nh4 Bf7 41.Qd4+ Ke6 42.Nf5 Bf8 43.Qxf4 Kd7 44.Nd4 Qe1+ 45.Kg2 Bd5+ 46.Be4 Bxe4+ 47.Nxe4 Be7 48.Nxb5 Nf8 49.Nbxd6 Ne6 50.Qe5  1-0"},{"tags":{"Event":"Cambridge","Site":"Cambridge","Date":"1977.??.??","Round":"?","White":"Fischer, Robert James","Black":"Greenblatt Programm","Result":"1-0","WhiteElo":"","BlackElo":"","ECO":"C33"},"moveText":"1.e4 e5 2.f4 exf4 3.Bc4 d5 4.Bxd5 Nf6 5.Nc3 Bb4 6.Nf3 O-O 7.O-O Nxd5 8.Nxd5 Bd6 9.d4 g5 10.Nxg5 Qxg5 11.e5 Bh3 12.Rf2 Bxe5 13.dxe5 c6 14.Bxf4 Qg7 15.Nf6+ Kh8 16.Qh5 Rd8 17.Qxh3 Na6 18.Rf3 Qg6 19.Rc1 Kg7 20.Rg3 Rh8 21.Qh6+  1-0"},{"tags":{"Event":"Cambridge","Site":"Cambridge","Date":"1977.??.??","Round":"?","White":"Greenblatt Programm","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"","BlackElo":"","ECO":"B34"},"moveText":"1.e4 c5 2.Nf3 g6 3.d4 Bg7 4.Nc3 cxd4 5.Nxd4 Nc6 6.Be3 Nf6 7.Nxc6 bxc6 8.e5 Ng8 9.f4 f6 10.exf6 Nxf6 11.Bc4 d5 12.Be2 Rb8 13.b3 Ng4 14.Bd4 e5 15.fxe5 O-O 16.Bxg4 Qh4+ 17.g3 Qxg4 18.Qxg4 Bxg4 19.Rf1 Rxf1+ 20.Kxf1 c5 21.Bf2 Bxe5 22.Be1 Rf8+ 23.Kg2 Rf3 24.h3 Rxc3 25.Bxc3 Bxc3 26.Rf1 Bf5 27.Rf2 h5 28.Re2 Kf7 29.Re3 Bd4 30.Rf3 Ke6 31.c3 Be5 32.Re3 d4 33.cxd4 cxd4 34.Re1 d3 35.h4 d2 36.Rd1 Bc3 37.Kf2 Bg4 38.Rh1 Bd4+ 39.Kg2 Kd5 40.a3 Ke4 41.Rf1 Kd3 42.Kh2 Ke2 43.Kg2 Bh3+ 44.Kxh3 Kxf1 45.b4 d1=Q 46.Kh2 Qe2+ 47.Kh3 Qg2+  0-1"},{"tags":{"Event":"Cambridge","Site":"Cambridge","Date":"1977.??.??","Round":"?","White":"Greenblatt Programm","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"","BlackElo":"","ECO":"B92"},"moveText":"1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be2 e5 7.Nb3 Be7 8.Be3 O-O 9.Qd3 Be6 10.O-O Nbd7 11.Nd5 Rc8 12.Nxe7+ Qxe7 13.f3 d5 14.Nd2 Qb4 15.Nb3 dxe4 16.Qd1 Nd5 17.Ba7 b6 18.c3 Qe7 19.fxe4 Ne3 20.Qd3 Nxf1 21.Qxa6 Ne3 22.Bxb6 Qg5 23.g3 Ra8 24.Ba7 h5 25.Qb7 h4 26.Kf2 hxg3+ 27.hxg3 f5 28.exf5 Rxf5+ 29.Ke1 Raf8 30.Kd2 Nc4+ 31.Kc2 Qg6 32.Qe4 Nd6 33.Qc6 Rf2+ 34.Kd1 Bg4 35.Bxf2 Qd3+ 36.Kc1 Bxe2 37.Nd2 Rxf2 38.Qxd7 Rf1+ 39.Nxf1 Qd1+  0-1"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"21","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"2660","BlackElo":"2785","ECO":"B46"},"moveText":"1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Nc3 Nc6 6.Be3 Nf6 7.Bd3 d5 8.exd5 exd5 9.O-O Bd6 10.Nxc6 bxc6 11.Bd4 O-O 12.Qf3 Be6 13.Rfe1 c5 14.Bxf6 Qxf6 15.Qxf6 gxf6 16.Rad1 Rfd8 17.Be2 Rab8 18.b3 c4 19.Nxd5 Bxd5 20.Rxd5 Bxh2+ 21.Kxh2 Rxd5 22.Bxc4 Rd2 23.Bxa6 Rxc2 24.Re2 Rxe2 25.Bxe2 Rd8 26.a4 Rd2 27.Bc4 Ra2 28.Kg3 Kf8 29.Kf3 Ke7 30.g4 f5 31.gxf5 f6 32.Bg8 h6 33.Kg3 Kd6 34.Kf3 Ra1 35.Kg2 Ke5 36.Be6 Kf4 37.Bd7 Rb1 38.Be6 Rb2 39.Bc4 Ra2 40.Be6 h5 41.Bd7  0-1"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"20","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2660","ECO":"B68"},"moveText":"1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 d6 6.Bg5 e6 7.Qd2 a6 8.O-O-O Bd7 9.f4 Be7 10.Be2 O-O 11.Bf3 h6 12.Bh4 Nxe4 13.Bxe7 Nxd2 14.Bxd8 Nxf3 15.Nxf3 Rfxd8 16.Rxd6 Kf8 17.Rhd1 Ke7 18.Na4 Be8 19.Rxd8 Rxd8 20.Nc5 Rb8 21.Rd3 a5 22.Rb3 b5 23.a3 a4 24.Rc3 Rd8 25.Nd3 f6 26.Rc5 Rb8 27.Rc3 g5 28.g3 Kd6 29.Nc5 g4 30.Ne4+ Ke7 31.Ne1 Rd8 32.Nd3 Rd4 33.Nef2 h5 34.Rc5 Rd5 35.Rc3 Nd4 36.Rc7+ Rd7 37.Rxd7+ Bxd7 38.Ne1 e5 39.fxe5 fxe5 40.Kd2 Bf5 41.Nd1 Kd6 42.Ne3 Be6 43.Kd3 Bf7 44.Kc3 Kc6 45.Kd3 Kc5 46.Ke4 Kd6 47.Kd3 Bg6+ 48.Kc3 Kc5 49.Nd3+ Kd6 50.Ne1 Kc6 51.Kd2 Kc5 52.Nd3+ Kd6 53.Ne1 Ne6 54.Kc3 Nd4  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"19","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2660","BlackElo":"2785","ECO":"B05"},"moveText":"1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 Bg4 5.Be2 e6 6.O-O Be7 7.h3 Bh5 8.c4 Nb6 9.Nc3 O-O 10.Be3 d5 11.c5 Bxf3 12.Bxf3 Nc4 13.b3 Nxe3 14.fxe3 b6 15.e4 c6 16.b4 bxc5 17.bxc5 Qa5 18.Nxd5 Bg5 19.Bh5 cxd5 20.Bxf7+ Rxf7 21.Rxf7 Qd2 22.Qxd2 Bxd2 23.Raf1 Nc6 24.exd5 exd5 25.Rd7 Be3+ 26.Kh1 Bxd4 27.e6 Be5 28.Rxd5 Re8 29.Re1 Rxe6 30.Rd6 Kf7 31.Rxc6 Rxc6 32.Rxe5 Kf6 33.Rd5 Ke6 34.Rh5 h6 35.Kh2 Ra6 36.c6 Rxc6 37.Ra5 a6 38.Kg3 Kf6 39.Kf3 Rc3+ 40.Kf2 Rc2+  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"18","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2660","ECO":"B69"},"moveText":"1.e4 c5 2.Nf3 d6 3.Nc3 Nc6 4.d4 cxd4 5.Nxd4 Nf6 6.Bg5 e6 7.Qd2 a6 8.O-O-O Bd7 9.f4 Be7 10.Nf3 b5 11.Bxf6 gxf6 12.Bd3 Qa5 13.Kb1 b4 14.Ne2 Qc5 15.f5 a5 16.Nf4 a4 17.Rc1 Rb8 18.c3 b3 19.a3 Ne5 20.Rhf1 Nc4 21.Bxc4 Qxc4 22.Rce1 Kd8 23.Ka1 Rb5 24.Nd4 Ra5 25.Nd3 Kc7 26.Nb4 h5 27.g3 Re5 28.Nd3 Rb8 29.Qe2 Ra5 30.fxe6 fxe6 31.Rf2 e5 32.Nf5 Bxf5 33.Rxf5 d5 34.exd5 Qxd5 35.Nb4 Qd7 36.Rxh5 Bxb4 37.cxb4 Rd5 38.Rc1+ Kb7 39.Qe4 Rc8 40.Rb1 Kb6 41.Rh7 Rd4 42.Qg6 Qc6 43.Rf7 Rd6 44.Qh6 Qf3 45.Qh7 Qc6 46.Qh6 Qf3 47.Qh7 Qc6  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"17","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2660","BlackElo":"2785","ECO":"B09"},"moveText":"1.e4 d6 2.d4 g6 3.Nc3 Nf6 4.f4 Bg7 5.Nf3 c5 6.dxc5 Qa5 7.Bd3 Qxc5 8.Qe2 O-O 9.Be3 Qa5 10.O-O Bg4 11.Rad1 Nc6 12.Bc4 Nh5 13.Bb3 Bxc3 14.bxc3 Qxc3 15.f5 Nf6 16.h3 Bxf3 17.Qxf3 Na5 18.Rd3 Qc7 19.Bh6 Nxb3 20.cxb3 Qc5+ 21.Kh1 Qe5 22.Bxf8 Rxf8 23.Re3 Rc8 24.fxg6 hxg6 25.Qf4 Qxf4 26.Rxf4 Nd7 27.Rf2 Ne5 28.Kh2 Rc1 29.Ree2 Nc6 30.Rc2 Re1 31.Rfe2 Ra1 32.Kg3 Kg7 33.Rcd2 Rf1 34.Rf2 Re1 35.Rfe2 Rf1 36.Re3 a6 37.Rc3 Re1 38.Rc4 Rf1 39.Rdc2 Ra1 40.Rf2 Re1 41.Rfc2 g5 42.Rc1 Re2 43.R1c2 Re1 44.Rc1 Re2 45.R1c2  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"16","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2660","ECO":"C69"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O f6 6.d4 Bg4 7.dxe5 Qxd1 8.Rxd1 fxe5 9.Rd3 Bd6 10.Nbd2 Nf6 11.Nc4 Nxe4 12.Ncxe5 Bxf3 13.Nxf3 O-O 14.Be3 b5 15.c4 Rab8 16.Rc1 bxc4 17.Rd4 Rfe8 18.Nd2 Nxd2 19.Rxd2 Re4 20.g3 Be5 21.Rcc2 Kf7 22.Kg2 Rxb2 23.Kf3 c3 24.Kxe4 cxd2 25.Rxd2 Rb5 26.Rc2 Bd6 27.Rxc6 Ra5 28.Bf4 Ra4+ 29.Kf3 Ra3+ 30.Ke4 Rxa2 31.Bxd6 cxd6 32.Rxd6 Rxf2 33.Rxa6 Rxh2 34.Kf3 Rd2 35.Ra7+ Kf6 36.Ra6+ Ke7 37.Ra7+ Rd7 38.Ra2 Ke6 39.Kg2 Re7 40.Kh3 Kf6 41.Ra6+ Re6 42.Ra5 h6 43.Ra2 Kf5 44.Rf2+ Kg5 45.Rf7 g6 46.Rf4 h5 47.Rf3 Rf6 48.Ra3 Re6 49.Rf3 Re4 50.Ra3 Kh6 51.Ra6 Re5 52.Kh4 Re4+ 53.Kh3 Re7 54.Kh4 Re5 55.Rb6 Kg7 56.Rb4 Kh6 57.Rb6 Re1 58.Kh3 Rh1+ 59.Kg2 Ra1 60.Kh3 Ra4  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"15","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2660","BlackElo":"2785","ECO":"B99"},"moveText":"1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7 10.Bd3 b5 11.Rhe1 Bb7 12.Qg3 O-O-O 13.Bxf6 Nxf6 14.Qxg7 Rdf8 15.Qg3 b4 16.Na4 Rhg8 17.Qf2 Nd7 18.Kb1 Kb8 19.c3 Nc5 20.Bc2 bxc3 21.Nxc3 Bf6 22.g3 h5 23.e5 dxe5 24.fxe5 Bh8 25.Nf3 Rd8 26.Rxd8+ Rxd8 27.Ng5 Bxe5 28.Qxf7 Rd7 29.Qxh5 Bxc3 30.bxc3 Qb6+ 31.Kc1 Qa5 32.Qh8+ Ka7 33.a4 Nd3+ 34.Bxd3 Rxd3 35.Kc2 Rd5 36.Re4 Rd8 37.Qg7 Qf5 38.Kb3 Qd5+ 39.Ka3 Qd2 40.Rb4 Qc1+ 41.Rb2 Qa1+ 42.Ra2 Qc1+ 43.Rb2 Qa1+  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"14","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2660","ECO":"D37"},"moveText":"1.c4 e6 2.Nf3 d5 3.d4 Nf6 4.Nc3 Be7 5.Bf4 O-O 6.e3 c5 7.dxc5 Nc6 8.cxd5 exd5 9.Be2 Bxc5 10.O-O Be6 11.Rc1 Rc8 12.a3 h6 13.Bg3 Bb6 14.Ne5 Ne7 15.Na4 Ne4 16.Rxc8 Bxc8 17.Nf3 Bd7 18.Be5 Bxa4 19.Qxa4 Nc6 20.Bf4 Qf6 21.Bb5 Qxb2 22.Bxc6 Nc3 23.Qb4 Qxb4 24.axb4 bxc6 25.Be5 Nb5 26.Rc1 Rc8 27.Nd4 f6 28.Bxf6 Bxd4 29.Bxd4 Nxd4 30.exd4 Rb8 31.Rxc6 Rxb4 32.Kf1 Rxd4 33.Ra6 Kf7 34.Rxa7+ Kf6 35.Rd7 h5 36.Ke2 g5 37.Ke3 Re4+ 38.Kd3 Ke6 39.Rg7 Kf6 40.Rd7 Ke6  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"13","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"2660","BlackElo":"2785","ECO":"B04"},"moveText":"1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 g6 5.Bc4 Nb6 6.Bb3 Bg7 7.Nbd2 O-O 8.h3 a5 9.a4 dxe5 10.dxe5 Na6 11.O-O Nc5 12.Qe2 Qe8 13.Ne4 Nbxa4 14.Bxa4 Nxa4 15.Re1 Nb6 16.Bd2 a4 17.Bg5 h6 18.Bh4 Bf5 19.g4 Be6 20.Nd4 Bc4 21.Qd2 Qd7 22.Rad1 Rfe8 23.f4 Bd5 24.Nc5 Qc8 25.Qc3 e6 26.Kh2 Nd7 27.Nd3 c5 28.Nb5 Qc6 29.Nd6 Qxd6 30.exd6 Bxc3 31.bxc3 f6 32.g5 hxg5 33.fxg5 f5 34.Bg3 Kf7 35.Ne5+ Nxe5 36.Bxe5 b5 37.Rf1 Rh8 38.Bf6 a3 39.Rf4 a2 40.c4 Bxc4 41.d7 Bd5 42.Kg3 Ra3+ 43.c3 Rha8 44.Rh4 e5 45.Rh7+ Ke6 46.Re7+ Kd6 47.Rxe5 Rxc3+ 48.Kf2 Rc2+ 49.Ke1 Kxd7 50.Rexd5+ Kc6 51.Rd6+ Kb7 52.Rd7+ Ka6 53.R7d2 Rxd2 54.Kxd2 b4 55.h4 Kb5 56.h5 c4 57.Ra1 gxh5 58.g6 h4 59.g7 h3 60.Be7 Rg8 61.Bf8 h2 62.Kc2 Kc6 63.Rd1 b3+ 64.Kc3 h1=Q 65.Rxh1 Kd5 66.Kb2 f4 67.Rd1+ Ke4 68.Rc1 Kd3 69.Rd1+ Ke2 70.Rc1 f3 71.Bc5 Rxg7 72.Rxc4 Rd7 73.Re4+ Kf1 74.Bd4 f2  0-1"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"12","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1/2-1/2","WhiteElo":"2785","BlackElo":"2660","ECO":"D66"},"moveText":"1.c4 e6 2.Nf3 d5 3.d4 Nf6 4.Nc3 Be7 5.Bg5 h6 6.Bh4 O-O 7.e3 Nbd7 8.Rc1 c6 9.Bd3 dxc4 10.Bxc4 b5 11.Bd3 a6 12.a4 bxa4 13.Nxa4 Qa5+ 14.Nd2 Bb4 15.Nc3 c5 16.Nb3 Qd8 17.O-O cxd4 18.Nxd4 Bb7 19.Be4 Qb8 20.Bg3 Qa7 21.Nc6 Bxc6 22.Bxc6 Rac8 23.Na4 Rfd8 24.Bf3 a5 25.Rc6 Rxc6 26.Bxc6 Rc8 27.Bf3 Qa6 28.h3 Qb5 29.Be2 Qc6 30.Bf3 Qb5 31.b3 Be7 32.Be2 Qb4 33.Ba6 Rc6 34.Bd3 Nc5 35.Qf3 Rc8 36.Nxc5 Bxc5 37.Rc1 Rd8 38.Bc4 Qd2 39.Rf1 Bb4 40.Bc7 Rd7 41.Qc6 Qc2 42.Be5 Rd2 43.Qa8+ Kh7 44.Bxf6 gxf6 45.Qf3 f5 46.g4 Qe4 47.Kg2 Kg6 48.Rc1 Ba3 49.Ra1 Bb4 50.Rc1 Be7 51.gxf5+ exf5 52.Re1 Rxf2+ 53.Kxf2 Bh4+ 54.Ke2 Qxf3+ 55.Kxf3 Bxe1  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"11","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1-0","WhiteElo":"2660","BlackElo":"2785","ECO":"B97"},"moveText":"1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Qb6 8.Qd2 Qxb2 9.Nb3 Qa3 10.Bxf6 gxf6 11.Be2 h5 12.O-O Nc6 13.Kh1 Bd7 14.Nb1 Qb4 15.Qe3 d5 16.exd5 Ne7 17.c4 Nf5 18.Qd3 h4 19.Bg4 Nd6 20.N1d2 f5 21.a3 Qb6 22.c5 Qb5 23.Qc3 fxg4 24.a4 h3 25.axb5 hxg2+ 26.Kxg2 Rh3 27.Qf6 Nf5 28.c6 Bc8 29.dxe6 fxe6 30.Rfe1 Be7 31.Rxe6  1-0"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"10","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2660","ECO":"C95"},"moveText":"1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.b4 Bf8 14.a4 Nb6 15.a5 Nbd7 16.Bb2 Qb8 17.Rb1 c5 18.bxc5 dxc5 19.dxe5 Nxe5 20.Nxe5 Qxe5 21.c4 Qf4 22.Bxf6 Qxf6 23.cxb5 Red8 24.Qc1 Qc3 25.Nf3 Qxa5 26.Bb3 axb5 27.Qf4 Rd7 28.Ne5 Qc7 29.Rbd1 Re7 30.Bxf7+ Rxf7 31.Qxf7+ Qxf7 32.Nxf7 Bxe4 33.Rxe4 Kxf7 34.Rd7+ Kf6 35.Rb7 Ra1+ 36.Kh2 Bd6+ 37.g3 b4 38.Kg2 h5 39.Rb6 Rd1 40.Kf3 Kf7 41.Ke2 Rd5 42.f4 g6 43.g4 hxg4 44.hxg4 g5 45.f5 Be5 46.Rb5 Kf6 47.Rexb4 Bd4 48.Rb6+ Ke5 49.Kf3 Rd8 50.Rb8 Rd7 51.R4b7 Rd6 52.Rb6 Rd7 53.Rg6 Kd5 54.Rxg5 Be5 55.f6 Kd4 56.Rb1  1-0"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"9","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2660","BlackElo":"2785","ECO":"D41"},"moveText":"1.d4 Nf6 2.c4 e6 3.Nf3 d5 4.Nc3 c5 5.cxd5 Nxd5 6.e4 Nxc3 7.bxc3 cxd4 8.cxd4 Nc6 9.Bc4 b5 10.Bd3 Bb4+ 11.Bd2 Bxd2+ 12.Qxd2 a6 13.a4 O-O 14.Qc3 Bb7 15.axb5 axb5 16.O-O Qb6 17.Rab1 b4 18.Qd2 Nxd4 19.Nxd4 Qxd4 20.Rxb4 Qd7 21.Qe3 Rfd8 22.Rfb1 Qxd3 23.Qxd3 Rxd3 24.Rxb7 g5 25.Rb8+ Rxb8 26.Rxb8+ Kg7 27.f3 Rd2 28.h4 h6 29.hxg5 hxg5  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"8","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2660","ECO":"A39"},"moveText":"1.c4 c5 2.Nc3 Nc6 3.Nf3 Nf6 4.g3 g6 5.Bg2 Bg7 6.O-O O-O 7.d4 cxd4 8.Nxd4 Nxd4 9.Qxd4 d6 10.Bg5 Be6 11.Qf4 Qa5 12.Rac1 Rab8 13.b3 Rfc8 14.Qd2 a6 15.Be3 b5 16.Ba7 bxc4 17.Bxb8 Rxb8 18.bxc4 Bxc4 19.Rfd1 Nd7 20.Nd5 Qxd2 21.Nxe7+ Kf8 22.Rxd2 Kxe7 23.Rxc4 Rb1+ 24.Bf1 Nc5 25.Kg2 a5 26.e4 Ba1 27.f4 f6 28.Re2 Ke6 29.Rec2 Bb2 30.Be2 h5 31.Rd2 Ba3 32.f5+ gxf5 33.exf5+ Ke5 34.Rcd4 Kxf5 35.Rd5+ Ke6 36.Rxd6+ Ke7 37.Rc6  1-0"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"7","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"1/2-1/2","WhiteElo":"2660","BlackElo":"2785","ECO":"B97"},"moveText":"1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Qb6 8.Qd2 Qxb2 9.Nb3 Qa3 10.Bd3 Be7 11.O-O h6 12.Bh4 Nxe4 13.Nxe4 Bxh4 14.f5 exf5 15.Bb5+ axb5 16.Nxd6+ Kf8 17.Nxc8 Nc6 18.Nd6 Rd8 19.Nxb5 Qe7 20.Qf4 g6 21.a4 Bg5 22.Qc4 Be3+ 23.Kh1 f4 24.g3 g5 25.Rae1 Qb4 26.Qxb4+ Nxb4 27.Re2 Kg7 28.Na5 b6 29.Nc4 Nd5 30.Ncd6 Bc5 31.Nb7 Rc8 32.c4 Ne3 33.Rf3 Nxc4 34.gxf4 g4 35.Rd3 h5 36.h3 Na5 37.N7d6 Bxd6 38.Nxd6 Rc1+ 39.Kg2 Nc4 40.Ne8+ Kg6 41.h4 f6 42.Re6 Rc2+ 43.Kg1 Kf5 44.Ng7+ Kxf4 45.Rd4+ Kg3 46.Nf5+ Kf3 47.Ree4 Rc1+ 48.Kh2 Rc2+ 49.Kg1  1/2-1/2"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"6","White":"Fischer, Robert James","Black":"Spassky, Boris V","Result":"1-0","WhiteElo":"2785","BlackElo":"2660","ECO":"D59"},"moveText":"1.c4 e6 2.Nf3 d5 3.d4 Nf6 4.Nc3 Be7 5.Bg5 O-O 6.e3 h6 7.Bh4 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1 Be6 12.Qa4 c5 13.Qa3 Rc8 14.Bb5 a6 15.dxc5 bxc5 16.O-O Ra7 17.Be2 Nd7 18.Nd4 Qf8 19.Nxe6 fxe6 20.e4 d4 21.f4 Qe7 22.e5 Rb8 23.Bc4 Kh8 24.Qh3 Nf8 25.b3 a5 26.f5 exf5 27.Rxf5 Nh7 28.Rcf1 Qd8 29.Qg3 Re7 30.h4 Rbb7 31.e6 Rbc7 32.Qe5 Qe8 33.a4 Qd8 34.R1f2 Qe8 35.R2f3 Qd8 36.Bd3 Qe8 37.Qe4 Nf6 38.Rxf6 gxf6 39.Rxf6 Kg8 40.Bc4 Kh8 41.Qf4  1-0"},{"tags":{"Event":"World Championship 28th","Site":"Reykjavik","Date":"1972.??.??","Round":"5","White":"Spassky, Boris V","Black":"Fischer, Robert James","Result":"0-1","WhiteElo":"2660","BlackElo":"2785","ECO":"E41"},"moveText":"1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Nf3 c5 5.e3 Nc6 6.Bd3 Bxc3+ 7.bxc3 d6 8.e4 e5 9.d5 Ne7 10.Nh4 h6 11.f4 Ng6 12.Nxg6 fxg6 13.fxe5 dxe5 14.Be3 b6 15.O-O O-O 16.a4 a5 17.Rb1 Bd7 18.Rb2 Rb8 19.Rbf2 Qe7 20.Bc2 g5 21.Bd2 Qe8 22.Be1 Qg6 23.Qd3 Nh5 24.Rxf8+ Rxf8 25.Rxf8+ Kxf8 26.Bd1 Nf4 27.Qc2 Bxa4  0-1"}]}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlbmluZ3MuZmUxMWRlZGUzMjE2MzNlYTFlMDIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywrQkFBK0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsYUFBYTtBQUN2Qix3QkFBd0IsYUFBYTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixjQUFjO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsK0JBQStCO0FBQ2pFO0FBQ0EsNENBQTRDLFNBQVM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsU0FBUztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGNBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QWdDO0FBQ2hDLDZCQUE2QjtBQUM3QixZQUFZO0FBRVosdUNBQXVDO0FBRXZDLCtEQUErRDtBQUMvRCxrREFBa0Q7QUFDbEQscUJBQXFCO0FBQ3JCLHVDQUF1QztBQUN2QyxzREFBc0Q7QUFDdEQsNkRBQTZEO0FBQzdELCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLFFBQVE7QUFFUixJQUFJO0FBQ0osc0ZBQXNGO0FBQ3RGLDJDQUEyQztBQUMzQyxxQkFBcUI7QUFFckIsc0ZBQXNGO0FBQ3RGLHdDQUF3QztBQUN4QyxrQ0FBa0M7QUFFbEMsMEJBQTBCO0FBQzFCLGtFQUFrRTtBQUVsRSxrRkFBa0Y7QUFDbEYsd0VBQXdFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9jaGVzcy5qcy9kaXN0L2VzbS9jaGVzcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvZ2FtZUJyb3dzZXIvZ2FtZUJyb3dzZXIuY3NzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvcGFnZXMvb3BlbmluZ3Mvb3BlbmluZ3MuY3NzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvZ2FtZUJyb3dzZXIvZ2FtZUJyb3dzZXIuY3NzPzY3NGIiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9wYWdlcy9vcGVuaW5ncy9vcGVuaW5ncy5jc3M/YTgyZSIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9jaGVzc2JvYXJkL0NoZXNzYm9hcmQudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL0Fycm93TGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL0JvYXJkTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL0NvcmRzTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTGF5ZXJzL1BpZWNlTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvTW91c2VFdmVudHMudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvUGllY2VGYWN0b3J5LnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9jaGVzc2JvYXJkL1NoYXJlZC50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9TcXVhcmVGYWN0b3J5LnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9nYW1lQnJvd3Nlci9BbmltYXRpb24udHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVCcm93c2VyL0NhcHR1cmVQaWVjZUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVCcm93c2VyL0dhbWVCcm93c2VyLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9nYW1lQnJvd3Nlci9QbGF5ZXJJbmZvLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvcGFnZXMvb3BlbmluZ3MvT3BlbmluZ3MudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDIzLCBKZWZmIEhseXdhIChqaGx5d2FAZ21haWwuY29tKVxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRVxuICogTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUlxuICogQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0ZcbiAqIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xuICogSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU5cbiAqIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpXG4gKiBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxuICogUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cbmV4cG9ydCBjb25zdCBXSElURSA9ICd3JztcbmV4cG9ydCBjb25zdCBCTEFDSyA9ICdiJztcbmV4cG9ydCBjb25zdCBQQVdOID0gJ3AnO1xuZXhwb3J0IGNvbnN0IEtOSUdIVCA9ICduJztcbmV4cG9ydCBjb25zdCBCSVNIT1AgPSAnYic7XG5leHBvcnQgY29uc3QgUk9PSyA9ICdyJztcbmV4cG9ydCBjb25zdCBRVUVFTiA9ICdxJztcbmV4cG9ydCBjb25zdCBLSU5HID0gJ2snO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUE9TSVRJT04gPSAncm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDEnO1xuY29uc3QgRU1QVFkgPSAtMTtcbmNvbnN0IEZMQUdTID0ge1xuICAgIE5PUk1BTDogJ24nLFxuICAgIENBUFRVUkU6ICdjJyxcbiAgICBCSUdfUEFXTjogJ2InLFxuICAgIEVQX0NBUFRVUkU6ICdlJyxcbiAgICBQUk9NT1RJT046ICdwJyxcbiAgICBLU0lERV9DQVNUTEU6ICdrJyxcbiAgICBRU0lERV9DQVNUTEU6ICdxJyxcbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbmV4cG9ydCBjb25zdCBTUVVBUkVTID0gW1xuICAgICdhOCcsICdiOCcsICdjOCcsICdkOCcsICdlOCcsICdmOCcsICdnOCcsICdoOCcsXG4gICAgJ2E3JywgJ2I3JywgJ2M3JywgJ2Q3JywgJ2U3JywgJ2Y3JywgJ2c3JywgJ2g3JyxcbiAgICAnYTYnLCAnYjYnLCAnYzYnLCAnZDYnLCAnZTYnLCAnZjYnLCAnZzYnLCAnaDYnLFxuICAgICdhNScsICdiNScsICdjNScsICdkNScsICdlNScsICdmNScsICdnNScsICdoNScsXG4gICAgJ2E0JywgJ2I0JywgJ2M0JywgJ2Q0JywgJ2U0JywgJ2Y0JywgJ2c0JywgJ2g0JyxcbiAgICAnYTMnLCAnYjMnLCAnYzMnLCAnZDMnLCAnZTMnLCAnZjMnLCAnZzMnLCAnaDMnLFxuICAgICdhMicsICdiMicsICdjMicsICdkMicsICdlMicsICdmMicsICdnMicsICdoMicsXG4gICAgJ2ExJywgJ2IxJywgJ2MxJywgJ2QxJywgJ2UxJywgJ2YxJywgJ2cxJywgJ2gxJ1xuXTtcbmNvbnN0IEJJVFMgPSB7XG4gICAgTk9STUFMOiAxLFxuICAgIENBUFRVUkU6IDIsXG4gICAgQklHX1BBV046IDQsXG4gICAgRVBfQ0FQVFVSRTogOCxcbiAgICBQUk9NT1RJT046IDE2LFxuICAgIEtTSURFX0NBU1RMRTogMzIsXG4gICAgUVNJREVfQ0FTVExFOiA2NCxcbn07XG4vKlxuICogTk9URVMgQUJPVVQgMHg4OCBNT1ZFIEdFTkVSQVRJT04gQUxHT1JJVEhNXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBGcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qaGx5d2EvY2hlc3MuanMvaXNzdWVzLzIzMFxuICpcbiAqIEEgbG90IG9mIHBlb3BsZSBhcmUgY29uZnVzZWQgd2hlbiB0aGV5IGZpcnN0IHNlZSB0aGUgaW50ZXJuYWwgcmVwcmVzZW50YXRpb25cbiAqIG9mIGNoZXNzLmpzLiBJdCB1c2VzIHRoZSAweDg4IE1vdmUgR2VuZXJhdGlvbiBBbGdvcml0aG0gd2hpY2ggaW50ZXJuYWxseVxuICogc3RvcmVzIHRoZSBib2FyZCBhcyBhbiA4eDE2IGFycmF5LiBUaGlzIGlzIHB1cmVseSBmb3IgZWZmaWNpZW5jeSBidXQgaGFzIGFcbiAqIGNvdXBsZSBvZiBpbnRlcmVzdGluZyBiZW5lZml0czpcbiAqXG4gKiAxLiAweDg4IG9mZmVycyBhIHZlcnkgaW5leHBlbnNpdmUgXCJvZmYgdGhlIGJvYXJkXCIgY2hlY2suIEJpdHdpc2UgQU5EICgmKSBhbnlcbiAqICAgIHNxdWFyZSB3aXRoIDB4ODgsIGlmIHRoZSByZXN1bHQgaXMgbm9uLXplcm8gdGhlbiB0aGUgc3F1YXJlIGlzIG9mZiB0aGVcbiAqICAgIGJvYXJkLiBGb3IgZXhhbXBsZSwgYXNzdW1pbmcgYSBrbmlnaHQgc3F1YXJlIEE4ICgwIGluIDB4ODggbm90YXRpb24pLFxuICogICAgdGhlcmUgYXJlIDggcG9zc2libGUgZGlyZWN0aW9ucyBpbiB3aGljaCB0aGUga25pZ2h0IGNhbiBtb3ZlLiBUaGVzZVxuICogICAgZGlyZWN0aW9ucyBhcmUgcmVsYXRpdmUgdG8gdGhlIDh4MTYgYm9hcmQgYW5kIGFyZSBzdG9yZWQgaW4gdGhlXG4gKiAgICBQSUVDRV9PRkZTRVRTIG1hcC4gT25lIHBvc3NpYmxlIG1vdmUgaXMgQTggLSAxOCAodXAgb25lIHNxdWFyZSwgYW5kIHR3b1xuICogICAgc3F1YXJlcyB0byB0aGUgbGVmdCAtIHdoaWNoIGlzIG9mZiB0aGUgYm9hcmQpLiAwIC0gMTggPSAtMTggJiAweDg4ID0gMHg4OFxuICogICAgKGJlY2F1c2Ugb2YgdHdvLWNvbXBsZW1lbnQgcmVwcmVzZW50YXRpb24gb2YgLTE4KS4gVGhlIG5vbi16ZXJvIHJlc3VsdFxuICogICAgbWVhbnMgdGhlIHNxdWFyZSBpcyBvZmYgdGhlIGJvYXJkIGFuZCB0aGUgbW92ZSBpcyBpbGxlZ2FsLiBUYWtlIHRoZVxuICogICAgb3Bwb3NpdGUgbW92ZSAoZnJvbSBBOCB0byBDNyksIDAgKyAxOCA9IDE4ICYgMHg4OCA9IDAuIEEgcmVzdWx0IG9mIHplcm9cbiAqICAgIG1lYW5zIHRoZSBzcXVhcmUgaXMgb24gdGhlIGJvYXJkLlxuICpcbiAqIDIuIFRoZSByZWxhdGl2ZSBkaXN0YW5jZSAob3IgZGlmZmVyZW5jZSkgYmV0d2VlbiB0d28gc3F1YXJlcyBvbiBhIDh4MTYgYm9hcmRcbiAqICAgIGlzIHVuaXF1ZSBhbmQgY2FuIGJlIHVzZWQgdG8gaW5leHBlbnNpdmVseSBkZXRlcm1pbmUgaWYgYSBwaWVjZSBvbiBhXG4gKiAgICBzcXVhcmUgY2FuIGF0dGFjayBhbnkgb3RoZXIgYXJiaXRyYXJ5IHNxdWFyZS4gRm9yIGV4YW1wbGUsIGxldCdzIHNlZSBpZiBhXG4gKiAgICBwYXduIG9uIEU3IGNhbiBhdHRhY2sgRTIuIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gRTcgKDIwKSAtIEUyICgxMDApIGlzXG4gKiAgICAtODAuIFdlIGFkZCAxMTkgdG8gbWFrZSB0aGUgQVRUQUNLUyBhcnJheSBpbmRleCBub24tbmVnYXRpdmUgKGJlY2F1c2UgdGhlXG4gKiAgICB3b3JzdCBjYXNlIGRpZmZlcmVuY2UgaXMgQTggLSBIMSA9IC0xMTkpLiBUaGUgQVRUQUNLUyBhcnJheSBjb250YWlucyBhXG4gKiAgICBiaXRtYXNrIG9mIHBpZWNlcyB0aGF0IGNhbiBhdHRhY2sgZnJvbSB0aGF0IGRpc3RhbmNlIGFuZCBkaXJlY3Rpb24uXG4gKiAgICBBVFRBQ0tTWy04MCArIDExOT0zOV0gZ2l2ZXMgdXMgMjQgb3IgMGIxMTAwMCBpbiBiaW5hcnkuIExvb2sgYXQgdGhlXG4gKiAgICBQSUVDRV9NQVNLUyBtYXAgdG8gZGV0ZXJtaW5lIHRoZSBtYXNrIGZvciBhIGdpdmVuIHBpZWNlIHR5cGUuIEluIG91ciBwYXduXG4gKiAgICBleGFtcGxlLCB3ZSB3b3VsZCBjaGVjayB0byBzZWUgaWYgMjQgJiAweDEgaXMgbm9uLXplcm8sIHdoaWNoIGl0IGlzXG4gKiAgICBub3QuIFNvLCBuYXR1cmFsbHksIGEgcGF3biBvbiBFNyBjYW4ndCBhdHRhY2sgYSBwaWVjZSBvbiBFMi4gSG93ZXZlciwgYVxuICogICAgcm9vayBjYW4gc2luY2UgMjQgJiAweDggaXMgbm9uLXplcm8uIFRoZSBvbmx5IHRoaW5nIGxlZnQgdG8gY2hlY2sgaXMgdGhhdFxuICogICAgdGhlcmUgYXJlIG5vIGJsb2NraW5nIHBpZWNlcyBiZXR3ZWVuIEU3IGFuZCBFMi4gVGhhdCdzIHdoZXJlIHRoZSBSQVlTXG4gKiAgICBhcnJheSBjb21lcyBpbi4gSXQgcHJvdmlkZXMgYW4gb2Zmc2V0IChpbiB0aGlzIGNhc2UgMTYpIHRvIGFkZCB0byBFNyAoMjApXG4gKiAgICB0byBjaGVjayBmb3IgYmxvY2tpbmcgcGllY2VzLiBFNyAoMjApICsgMTYgPSBFNiAoMzYpICsgMTYgPSBFNSAoNTIpIGV0Yy5cbiAqL1xuLy8gcHJldHRpZXItaWdub3JlXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmNvbnN0IE94ODggPSB7XG4gICAgYTg6IDAsIGI4OiAxLCBjODogMiwgZDg6IDMsIGU4OiA0LCBmODogNSwgZzg6IDYsIGg4OiA3LFxuICAgIGE3OiAxNiwgYjc6IDE3LCBjNzogMTgsIGQ3OiAxOSwgZTc6IDIwLCBmNzogMjEsIGc3OiAyMiwgaDc6IDIzLFxuICAgIGE2OiAzMiwgYjY6IDMzLCBjNjogMzQsIGQ2OiAzNSwgZTY6IDM2LCBmNjogMzcsIGc2OiAzOCwgaDY6IDM5LFxuICAgIGE1OiA0OCwgYjU6IDQ5LCBjNTogNTAsIGQ1OiA1MSwgZTU6IDUyLCBmNTogNTMsIGc1OiA1NCwgaDU6IDU1LFxuICAgIGE0OiA2NCwgYjQ6IDY1LCBjNDogNjYsIGQ0OiA2NywgZTQ6IDY4LCBmNDogNjksIGc0OiA3MCwgaDQ6IDcxLFxuICAgIGEzOiA4MCwgYjM6IDgxLCBjMzogODIsIGQzOiA4MywgZTM6IDg0LCBmMzogODUsIGczOiA4NiwgaDM6IDg3LFxuICAgIGEyOiA5NiwgYjI6IDk3LCBjMjogOTgsIGQyOiA5OSwgZTI6IDEwMCwgZjI6IDEwMSwgZzI6IDEwMiwgaDI6IDEwMyxcbiAgICBhMTogMTEyLCBiMTogMTEzLCBjMTogMTE0LCBkMTogMTE1LCBlMTogMTE2LCBmMTogMTE3LCBnMTogMTE4LCBoMTogMTE5XG59O1xuY29uc3QgUEFXTl9PRkZTRVRTID0ge1xuICAgIGI6IFsxNiwgMzIsIDE3LCAxNV0sXG4gICAgdzogWy0xNiwgLTMyLCAtMTcsIC0xNV0sXG59O1xuY29uc3QgUElFQ0VfT0ZGU0VUUyA9IHtcbiAgICBuOiBbLTE4LCAtMzMsIC0zMSwgLTE0LCAxOCwgMzMsIDMxLCAxNF0sXG4gICAgYjogWy0xNywgLTE1LCAxNywgMTVdLFxuICAgIHI6IFstMTYsIDEsIDE2LCAtMV0sXG4gICAgcTogWy0xNywgLTE2LCAtMTUsIDEsIDE3LCAxNiwgMTUsIC0xXSxcbiAgICBrOiBbLTE3LCAtMTYsIC0xNSwgMSwgMTcsIDE2LCAxNSwgLTFdLFxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuY29uc3QgQVRUQUNLUyA9IFtcbiAgICAyMCwgMCwgMCwgMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDAsIDAsIDAsIDIwLCAwLFxuICAgIDAsIDIwLCAwLCAwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMCwgMCwgMjAsIDAsIDAsXG4gICAgMCwgMCwgMjAsIDAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAwLCAyMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAyMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDIwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDIwLCAwLCAwLCAyNCwgMCwgMCwgMjAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgMjAsIDIsIDI0LCAyLCAyMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAyLCA1MywgNTYsIDUzLCAyLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDU2LCAwLCA1NiwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAyLCA1MywgNTYsIDUzLCAyLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDIwLCAyLCAyNCwgMiwgMjAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMjAsIDAsIDAsIDI0LCAwLCAwLCAyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAyMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDIwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDIwLCAwLCAwLCAwLCAwLCAyNCwgMCwgMCwgMCwgMCwgMjAsIDAsIDAsIDAsXG4gICAgMCwgMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAwLCAwLCAwLCAwLCAwLCAyMCwgMCwgMCxcbiAgICAyMCwgMCwgMCwgMCwgMCwgMCwgMCwgMjQsIDAsIDAsIDAsIDAsIDAsIDAsIDIwXG5dO1xuLy8gcHJldHRpZXItaWdub3JlXG5jb25zdCBSQVlTID0gW1xuICAgIDE3LCAwLCAwLCAwLCAwLCAwLCAwLCAxNiwgMCwgMCwgMCwgMCwgMCwgMCwgMTUsIDAsXG4gICAgMCwgMTcsIDAsIDAsIDAsIDAsIDAsIDE2LCAwLCAwLCAwLCAwLCAwLCAxNSwgMCwgMCxcbiAgICAwLCAwLCAxNywgMCwgMCwgMCwgMCwgMTYsIDAsIDAsIDAsIDAsIDE1LCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDE3LCAwLCAwLCAwLCAxNiwgMCwgMCwgMCwgMTUsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCwgMTcsIDAsIDAsIDE2LCAwLCAwLCAxNSwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAxNywgMCwgMTYsIDAsIDE1LCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIDAsIDAsIDE3LCAxNiwgMTUsIDAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDAsXG4gICAgMCwgMCwgMCwgMCwgMCwgMCwgLTE1LCAtMTYsIC0xNywgMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwLCAwLCAtMTUsIDAsIC0xNiwgMCwgLTE3LCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDAsIC0xNSwgMCwgMCwgLTE2LCAwLCAwLCAtMTcsIDAsIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgLTE1LCAwLCAwLCAwLCAtMTYsIDAsIDAsIDAsIC0xNywgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAtMTUsIDAsIDAsIDAsIDAsIC0xNiwgMCwgMCwgMCwgMCwgLTE3LCAwLCAwLCAwLFxuICAgIDAsIC0xNSwgMCwgMCwgMCwgMCwgMCwgLTE2LCAwLCAwLCAwLCAwLCAwLCAtMTcsIDAsIDAsXG4gICAgLTE1LCAwLCAwLCAwLCAwLCAwLCAwLCAtMTYsIDAsIDAsIDAsIDAsIDAsIDAsIC0xN1xuXTtcbmNvbnN0IFBJRUNFX01BU0tTID0geyBwOiAweDEsIG46IDB4MiwgYjogMHg0LCByOiAweDgsIHE6IDB4MTAsIGs6IDB4MjAgfTtcbmNvbnN0IFNZTUJPTFMgPSAncG5icnFrUE5CUlFLJztcbmNvbnN0IFBST01PVElPTlMgPSBbS05JR0hULCBCSVNIT1AsIFJPT0ssIFFVRUVOXTtcbmNvbnN0IFJBTktfMSA9IDc7XG5jb25zdCBSQU5LXzIgPSA2O1xuLypcbiAqIGNvbnN0IFJBTktfMyA9IDVcbiAqIGNvbnN0IFJBTktfNCA9IDRcbiAqIGNvbnN0IFJBTktfNSA9IDNcbiAqIGNvbnN0IFJBTktfNiA9IDJcbiAqL1xuY29uc3QgUkFOS183ID0gMTtcbmNvbnN0IFJBTktfOCA9IDA7XG5jb25zdCBTSURFUyA9IHtcbiAgICBbS0lOR106IEJJVFMuS1NJREVfQ0FTVExFLFxuICAgIFtRVUVFTl06IEJJVFMuUVNJREVfQ0FTVExFLFxufTtcbmNvbnN0IFJPT0tTID0ge1xuICAgIHc6IFtcbiAgICAgICAgeyBzcXVhcmU6IE94ODguYTEsIGZsYWc6IEJJVFMuUVNJREVfQ0FTVExFIH0sXG4gICAgICAgIHsgc3F1YXJlOiBPeDg4LmgxLCBmbGFnOiBCSVRTLktTSURFX0NBU1RMRSB9LFxuICAgIF0sXG4gICAgYjogW1xuICAgICAgICB7IHNxdWFyZTogT3g4OC5hOCwgZmxhZzogQklUUy5RU0lERV9DQVNUTEUgfSxcbiAgICAgICAgeyBzcXVhcmU6IE94ODguaDgsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFIH0sXG4gICAgXSxcbn07XG5jb25zdCBTRUNPTkRfUkFOSyA9IHsgYjogUkFOS183LCB3OiBSQU5LXzIgfTtcbmNvbnN0IFRFUk1JTkFUSU9OX01BUktFUlMgPSBbJzEtMCcsICcwLTEnLCAnMS8yLTEvMicsICcqJ107XG4vLyBFeHRyYWN0cyB0aGUgemVyby1iYXNlZCByYW5rIG9mIGFuIDB4ODggc3F1YXJlLlxuZnVuY3Rpb24gcmFuayhzcXVhcmUpIHtcbiAgICByZXR1cm4gc3F1YXJlID4+IDQ7XG59XG4vLyBFeHRyYWN0cyB0aGUgemVyby1iYXNlZCBmaWxlIG9mIGFuIDB4ODggc3F1YXJlLlxuZnVuY3Rpb24gZmlsZShzcXVhcmUpIHtcbiAgICByZXR1cm4gc3F1YXJlICYgMHhmO1xufVxuZnVuY3Rpb24gaXNEaWdpdChjKSB7XG4gICAgcmV0dXJuICcwMTIzNDU2Nzg5Jy5pbmRleE9mKGMpICE9PSAtMTtcbn1cbi8vIENvbnZlcnRzIGEgMHg4OCBzcXVhcmUgdG8gYWxnZWJyYWljIG5vdGF0aW9uLlxuZnVuY3Rpb24gYWxnZWJyYWljKHNxdWFyZSkge1xuICAgIGNvbnN0IGYgPSBmaWxlKHNxdWFyZSk7XG4gICAgY29uc3QgciA9IHJhbmsoc3F1YXJlKTtcbiAgICByZXR1cm4gKCdhYmNkZWZnaCcuc3Vic3RyaW5nKGYsIGYgKyAxKSArXG4gICAgICAgICc4NzY1NDMyMScuc3Vic3RyaW5nKHIsIHIgKyAxKSk7XG59XG5mdW5jdGlvbiBzd2FwQ29sb3IoY29sb3IpIHtcbiAgICByZXR1cm4gY29sb3IgPT09IFdISVRFID8gQkxBQ0sgOiBXSElURTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUZlbihmZW4pIHtcbiAgICAvLyAxc3QgY3JpdGVyaW9uOiA2IHNwYWNlLXNlcGVyYXRlZCBmaWVsZHM/XG4gICAgY29uc3QgdG9rZW5zID0gZmVuLnNwbGl0KC9cXHMrLyk7XG4gICAgaWYgKHRva2Vucy5sZW5ndGggIT09IDYpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBGRU46IG11c3QgY29udGFpbiBzaXggc3BhY2UtZGVsaW1pdGVkIGZpZWxkcycsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIDJuZCBjcml0ZXJpb246IG1vdmUgbnVtYmVyIGZpZWxkIGlzIGEgaW50ZWdlciB2YWx1ZSA+IDA/XG4gICAgY29uc3QgbW92ZU51bWJlciA9IHBhcnNlSW50KHRva2Vuc1s1XSwgMTApO1xuICAgIGlmIChpc05hTihtb3ZlTnVtYmVyKSB8fCBtb3ZlTnVtYmVyIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBGRU46IG1vdmUgbnVtYmVyIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gM3JkIGNyaXRlcmlvbjogaGFsZiBtb3ZlIGNvdW50ZXIgaXMgYW4gaW50ZWdlciA+PSAwP1xuICAgIGNvbnN0IGhhbGZNb3ZlcyA9IHBhcnNlSW50KHRva2Vuc1s0XSwgMTApO1xuICAgIGlmIChpc05hTihoYWxmTW92ZXMpIHx8IGhhbGZNb3ZlcyA8IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiAnSW52YWxpZCBGRU46IGhhbGYgbW92ZSBjb3VudGVyIG51bWJlciBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXInLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyA0dGggY3JpdGVyaW9uOiA0dGggZmllbGQgaXMgYSB2YWxpZCBlLnAuLXN0cmluZz9cbiAgICBpZiAoIS9eKC18W2FiY2RlZmdoXVszNl0pJC8udGVzdCh0b2tlbnNbM10pKSB7XG4gICAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIEZFTjogZW4tcGFzc2FudCBzcXVhcmUgaXMgaW52YWxpZCcgfTtcbiAgICB9XG4gICAgLy8gNXRoIGNyaXRlcmlvbjogM3RoIGZpZWxkIGlzIGEgdmFsaWQgY2FzdGxlLXN0cmluZz9cbiAgICBpZiAoL1tea0txUS1dLy50ZXN0KHRva2Vuc1syXSkpIHtcbiAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgRkVOOiBjYXN0bGluZyBhdmFpbGFiaWxpdHkgaXMgaW52YWxpZCcgfTtcbiAgICB9XG4gICAgLy8gNnRoIGNyaXRlcmlvbjogMm5kIGZpZWxkIGlzIFwid1wiICh3aGl0ZSkgb3IgXCJiXCIgKGJsYWNrKT9cbiAgICBpZiAoIS9eKHd8YikkLy50ZXN0KHRva2Vuc1sxXSkpIHtcbiAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgRkVOOiBzaWRlLXRvLW1vdmUgaXMgaW52YWxpZCcgfTtcbiAgICB9XG4gICAgLy8gN3RoIGNyaXRlcmlvbjogMXN0IGZpZWxkIGNvbnRhaW5zIDggcm93cz9cbiAgICBjb25zdCByb3dzID0gdG9rZW5zWzBdLnNwbGl0KCcvJyk7XG4gICAgaWYgKHJvd3MubGVuZ3RoICE9PSA4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogXCJJbnZhbGlkIEZFTjogcGllY2UgZGF0YSBkb2VzIG5vdCBjb250YWluIDggJy8nLWRlbGltaXRlZCByb3dzXCIsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIDh0aCBjcml0ZXJpb246IGV2ZXJ5IHJvdyBpcyB2YWxpZD9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIHJpZ2h0IHN1bSBvZiBmaWVsZHMgQU5EIG5vdCB0d28gbnVtYmVycyBpbiBzdWNjZXNzaW9uXG4gICAgICAgIGxldCBzdW1GaWVsZHMgPSAwO1xuICAgICAgICBsZXQgcHJldmlvdXNXYXNOdW1iZXIgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByb3dzW2ldLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBpZiAoaXNEaWdpdChyb3dzW2ldW2tdKSkge1xuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1dhc051bWJlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIEZFTjogcGllY2UgZGF0YSBpcyBpbnZhbGlkIChjb25zZWN1dGl2ZSBudW1iZXIpJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3VtRmllbGRzICs9IHBhcnNlSW50KHJvd3NbaV1ba10sIDEwKTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1dhc051bWJlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIS9eW3BybmJxa1BSTkJRS10kLy50ZXN0KHJvd3NbaV1ba10pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ0ludmFsaWQgRkVOOiBwaWVjZSBkYXRhIGlzIGludmFsaWQgKGludmFsaWQgcGllY2UpJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3VtRmllbGRzICs9IDE7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNXYXNOdW1iZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc3VtRmllbGRzICE9PSA4KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ0ludmFsaWQgRkVOOiBwaWVjZSBkYXRhIGlzIGludmFsaWQgKHRvbyBtYW55IHNxdWFyZXMgaW4gcmFuayknLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyA5dGggY3JpdGVyaW9uOiBpcyBlbi1wYXNzYW50IHNxdWFyZSBsZWdhbD9cbiAgICBpZiAoKHRva2Vuc1szXVsxXSA9PSAnMycgJiYgdG9rZW5zWzFdID09ICd3JykgfHxcbiAgICAgICAgKHRva2Vuc1szXVsxXSA9PSAnNicgJiYgdG9rZW5zWzFdID09ICdiJykpIHtcbiAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgRkVOOiBpbGxlZ2FsIGVuLXBhc3NhbnQgc3F1YXJlJyB9O1xuICAgIH1cbiAgICAvLyAxMHRoIGNyaXRlcmlvbjogZG9lcyBjaGVzcyBwb3NpdGlvbiBjb250YWluIGV4YWN0IHR3byBraW5ncz9cbiAgICBjb25zdCBraW5ncyA9IFtcbiAgICAgICAgeyBjb2xvcjogJ3doaXRlJywgcmVnZXg6IC9LL2cgfSxcbiAgICAgICAgeyBjb2xvcjogJ2JsYWNrJywgcmVnZXg6IC9rL2cgfSxcbiAgICBdO1xuICAgIGZvciAoY29uc3QgeyBjb2xvciwgcmVnZXggfSBvZiBraW5ncykge1xuICAgICAgICBpZiAoIXJlZ2V4LnRlc3QodG9rZW5zWzBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogYEludmFsaWQgRkVOOiBtaXNzaW5nICR7Y29sb3J9IGtpbmdgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0b2tlbnNbMF0ubWF0Y2gocmVnZXgpIHx8IFtdKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBgSW52YWxpZCBGRU46IHRvbyBtYW55ICR7Y29sb3J9IGtpbmdzYCB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIDExdGggY3JpdGVyaW9uOiBhcmUgYW55IHBhd25zIG9uIHRoZSBmaXJzdCBvciBlaWdodGggcm93cz9cbiAgICBpZiAoQXJyYXkuZnJvbShyb3dzWzBdICsgcm93c1s3XSkuc29tZSgoY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpID09PSAnUCcpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogJ0ludmFsaWQgRkVOOiBzb21lIHBhd25zIGFyZSBvbiB0aGUgZWRnZSByb3dzJyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbn1cbi8vIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byB1bmlxdWVseSBpZGVudGlmeSBhbWJpZ3VvdXMgbW92ZXNcbmZ1bmN0aW9uIGdldERpc2FtYmlndWF0b3IobW92ZSwgbW92ZXMpIHtcbiAgICBjb25zdCBmcm9tID0gbW92ZS5mcm9tO1xuICAgIGNvbnN0IHRvID0gbW92ZS50bztcbiAgICBjb25zdCBwaWVjZSA9IG1vdmUucGllY2U7XG4gICAgbGV0IGFtYmlndWl0aWVzID0gMDtcbiAgICBsZXQgc2FtZVJhbmsgPSAwO1xuICAgIGxldCBzYW1lRmlsZSA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGFtYmlnRnJvbSA9IG1vdmVzW2ldLmZyb207XG4gICAgICAgIGNvbnN0IGFtYmlnVG8gPSBtb3Zlc1tpXS50bztcbiAgICAgICAgY29uc3QgYW1iaWdQaWVjZSA9IG1vdmVzW2ldLnBpZWNlO1xuICAgICAgICAvKlxuICAgICAgICAgKiBpZiBhIG1vdmUgb2YgdGhlIHNhbWUgcGllY2UgdHlwZSBlbmRzIG9uIHRoZSBzYW1lIHRvIHNxdWFyZSwgd2UnbGwgbmVlZFxuICAgICAgICAgKiB0byBhZGQgYSBkaXNhbWJpZ3VhdG9yIHRvIHRoZSBhbGdlYnJhaWMgbm90YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIGlmIChwaWVjZSA9PT0gYW1iaWdQaWVjZSAmJiBmcm9tICE9PSBhbWJpZ0Zyb20gJiYgdG8gPT09IGFtYmlnVG8pIHtcbiAgICAgICAgICAgIGFtYmlndWl0aWVzKys7XG4gICAgICAgICAgICBpZiAocmFuayhmcm9tKSA9PT0gcmFuayhhbWJpZ0Zyb20pKSB7XG4gICAgICAgICAgICAgICAgc2FtZVJhbmsrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWxlKGZyb20pID09PSBmaWxlKGFtYmlnRnJvbSkpIHtcbiAgICAgICAgICAgICAgICBzYW1lRmlsZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChhbWJpZ3VpdGllcyA+IDApIHtcbiAgICAgICAgaWYgKHNhbWVSYW5rID4gMCAmJiBzYW1lRmlsZSA+IDApIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBpZiB0aGVyZSBleGlzdHMgYSBzaW1pbGFyIG1vdmluZyBwaWVjZSBvbiB0aGUgc2FtZSByYW5rIGFuZCBmaWxlIGFzXG4gICAgICAgICAgICAgKiB0aGUgbW92ZSBpbiBxdWVzdGlvbiwgdXNlIHRoZSBzcXVhcmUgYXMgdGhlIGRpc2FtYmlndWF0b3JcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzYW1lRmlsZSA+IDApIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBpZiB0aGUgbW92aW5nIHBpZWNlIHJlc3RzIG9uIHRoZSBzYW1lIGZpbGUsIHVzZSB0aGUgcmFuayBzeW1ib2wgYXMgdGhlXG4gICAgICAgICAgICAgKiBkaXNhbWJpZ3VhdG9yXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSkuY2hhckF0KDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZWxzZSB1c2UgdGhlIGZpbGUgc3ltYm9sXG4gICAgICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pLmNoYXJBdCgwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7XG59XG5mdW5jdGlvbiBhZGRNb3ZlKG1vdmVzLCBjb2xvciwgZnJvbSwgdG8sIHBpZWNlLCBjYXB0dXJlZCA9IHVuZGVmaW5lZCwgZmxhZ3MgPSBCSVRTLk5PUk1BTCkge1xuICAgIGNvbnN0IHIgPSByYW5rKHRvKTtcbiAgICBpZiAocGllY2UgPT09IFBBV04gJiYgKHIgPT09IFJBTktfMSB8fCByID09PSBSQU5LXzgpKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgUFJPTU9USU9OUy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcHJvbW90aW9uID0gUFJPTU9USU9OU1tpXTtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgdG8sXG4gICAgICAgICAgICAgICAgcGllY2UsXG4gICAgICAgICAgICAgICAgY2FwdHVyZWQsXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uLFxuICAgICAgICAgICAgICAgIGZsYWdzOiBmbGFncyB8IEJJVFMuUFJPTU9USU9OLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG1vdmVzLnB1c2goe1xuICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgdG8sXG4gICAgICAgICAgICBwaWVjZSxcbiAgICAgICAgICAgIGNhcHR1cmVkLFxuICAgICAgICAgICAgZmxhZ3MsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluZmVyUGllY2VUeXBlKHNhbikge1xuICAgIGxldCBwaWVjZVR5cGUgPSBzYW4uY2hhckF0KDApO1xuICAgIGlmIChwaWVjZVR5cGUgPj0gJ2EnICYmIHBpZWNlVHlwZSA8PSAnaCcpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHNhbi5tYXRjaCgvW2EtaF1cXGQuKlthLWhdXFxkLyk7XG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQQVdOO1xuICAgIH1cbiAgICBwaWVjZVR5cGUgPSBwaWVjZVR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAocGllY2VUeXBlID09PSAnbycpIHtcbiAgICAgICAgcmV0dXJuIEtJTkc7XG4gICAgfVxuICAgIHJldHVybiBwaWVjZVR5cGU7XG59XG4vLyBwYXJzZXMgYWxsIG9mIHRoZSBkZWNvcmF0b3JzIG91dCBvZiBhIFNBTiBzdHJpbmdcbmZ1bmN0aW9uIHN0cmlwcGVkU2FuKG1vdmUpIHtcbiAgICByZXR1cm4gbW92ZS5yZXBsYWNlKC89LywgJycpLnJlcGxhY2UoL1srI10/Wz8hXSokLywgJycpO1xufVxuZnVuY3Rpb24gdHJpbUZlbihmZW4pIHtcbiAgICAvKlxuICAgICAqIHJlbW92ZSBsYXN0IHR3byBmaWVsZHMgaW4gRkVOIHN0cmluZyBhcyB0aGV5J3JlIG5vdCBuZWVkZWQgd2hlbiBjaGVja2luZ1xuICAgICAqIGZvciByZXBldGl0aW9uXG4gICAgICovXG4gICAgcmV0dXJuIGZlbi5zcGxpdCgnICcpLnNsaWNlKDAsIDQpLmpvaW4oJyAnKTtcbn1cbmV4cG9ydCBjbGFzcyBDaGVzcyB7XG4gICAgX2JvYXJkID0gbmV3IEFycmF5KDEyOCk7XG4gICAgX3R1cm4gPSBXSElURTtcbiAgICBfaGVhZGVyID0ge307XG4gICAgX2tpbmdzID0geyB3OiBFTVBUWSwgYjogRU1QVFkgfTtcbiAgICBfZXBTcXVhcmUgPSAtMTtcbiAgICBfaGFsZk1vdmVzID0gMDtcbiAgICBfbW92ZU51bWJlciA9IDA7XG4gICAgX2hpc3RvcnkgPSBbXTtcbiAgICBfY29tbWVudHMgPSB7fTtcbiAgICBfY2FzdGxpbmcgPSB7IHc6IDAsIGI6IDAgfTtcbiAgICBfcG9zaXRpb25Db3VudHMgPSB7fTtcbiAgICBjb25zdHJ1Y3RvcihmZW4gPSBERUZBVUxUX1BPU0lUSU9OKSB7XG4gICAgICAgIHRoaXMubG9hZChmZW4pO1xuICAgIH1cbiAgICBjbGVhcih7IHByZXNlcnZlSGVhZGVycyA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICB0aGlzLl9ib2FyZCA9IG5ldyBBcnJheSgxMjgpO1xuICAgICAgICB0aGlzLl9raW5ncyA9IHsgdzogRU1QVFksIGI6IEVNUFRZIH07XG4gICAgICAgIHRoaXMuX3R1cm4gPSBXSElURTtcbiAgICAgICAgdGhpcy5fY2FzdGxpbmcgPSB7IHc6IDAsIGI6IDAgfTtcbiAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSBFTVBUWTtcbiAgICAgICAgdGhpcy5faGFsZk1vdmVzID0gMDtcbiAgICAgICAgdGhpcy5fbW92ZU51bWJlciA9IDE7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkgPSBbXTtcbiAgICAgICAgdGhpcy5fY29tbWVudHMgPSB7fTtcbiAgICAgICAgdGhpcy5faGVhZGVyID0gcHJlc2VydmVIZWFkZXJzID8gdGhpcy5faGVhZGVyIDoge307XG4gICAgICAgIC8qXG4gICAgICAgICAqIERlbGV0ZSB0aGUgU2V0VXAgYW5kIEZFTiBoZWFkZXJzIChpZiBwcmVzZXJ2ZWQpLCB0aGUgYm9hcmQgaXMgZW1wdHkgYW5kXG4gICAgICAgICAqIHRoZXNlIGhlYWRlcnMgZG9uJ3QgbWFrZSBzZW5zZSBpbiB0aGlzIHN0YXRlLiBUaGV5J2xsIGdldCBhZGRlZCBsYXRlclxuICAgICAgICAgKiB2aWEgLmxvYWQoKSBvciAucHV0KClcbiAgICAgICAgICovXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJbJ1NldFVwJ107XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJbJ0ZFTiddO1xuICAgICAgICAvKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZSBhIHByb3h5IHRoYXQga2VlcHMgdHJhY2sgb2YgcG9zaXRpb24gb2NjdXJyZW5jZSBjb3VudHMgZm9yIHRoZSBwdXJwb3NlXG4gICAgICAgICAqIG9mIHJlcGV0aXRpb24gY2hlY2tpbmcuIFRoZSBnZXR0ZXIgYW5kIHNldHRlciBtZXRob2RzIGF1dG9tYXRpY2FsbHkgaGFuZGxlIHRyaW1taW5nXG4gICAgICAgICAqIGlycmVsZXZlbnQgaW5mb3JtYXRpb24gZnJvbSB0aGUgZmVuLCBpbml0aWFsaXNpbmcgbmV3IHBvc2l0aW9ucywgYW5kIHJlbW92aW5nIG9sZFxuICAgICAgICAgKiBwb3NpdGlvbnMgZnJvbSB0aGUgcmVjb3JkIGlmIHRoZWlyIGNvdW50cyBhcmUgcmVkdWNlZCB0byAwLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcG9zaXRpb25Db3VudHMgPSBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgICAgIGdldDogKHRhcmdldCwgcG9zaXRpb24pID0+IHBvc2l0aW9uID09PSAnbGVuZ3RoJ1xuICAgICAgICAgICAgICAgID8gT2JqZWN0LmtleXModGFyZ2V0KS5sZW5ndGggLy8gbGVuZ3RoIGZvciB1bml0IHRlc3RpbmdcbiAgICAgICAgICAgICAgICA6IHRhcmdldD8uW3RyaW1GZW4ocG9zaXRpb24pXSB8fCAwLFxuICAgICAgICAgICAgc2V0OiAodGFyZ2V0LCBwb3NpdGlvbiwgY291bnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmltbWVkRmVuID0gdHJpbUZlbihwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGFyZ2V0W3RyaW1tZWRGZW5dO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3RyaW1tZWRGZW5dID0gY291bnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVtb3ZlSGVhZGVyKGtleSkge1xuICAgICAgICBpZiAoa2V5IGluIHRoaXMuX2hlYWRlcikge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlcltrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxvYWQoZmVuLCB7IHNraXBWYWxpZGF0aW9uID0gZmFsc2UsIHByZXNlcnZlSGVhZGVycyA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICBsZXQgdG9rZW5zID0gZmVuLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIC8vIGFwcGVuZCBjb21tb25seSBvbWl0dGVkIGZlbiB0b2tlbnNcbiAgICAgICAgaWYgKHRva2Vucy5sZW5ndGggPj0gMiAmJiB0b2tlbnMubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgY29uc3QgYWRqdXN0bWVudHMgPSBbJy0nLCAnLScsICcwJywgJzEnXTtcbiAgICAgICAgICAgIGZlbiA9IHRva2Vucy5jb25jYXQoYWRqdXN0bWVudHMuc2xpY2UoLSg2IC0gdG9rZW5zLmxlbmd0aCkpKS5qb2luKCcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgdG9rZW5zID0gZmVuLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGlmICghc2tpcFZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgb2ssIGVycm9yIH0gPSB2YWxpZGF0ZUZlbihmZW4pO1xuICAgICAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0b2tlbnNbMF07XG4gICAgICAgIGxldCBzcXVhcmUgPSAwO1xuICAgICAgICB0aGlzLmNsZWFyKHsgcHJlc2VydmVIZWFkZXJzIH0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwaWVjZSA9IHBvc2l0aW9uLmNoYXJBdChpKTtcbiAgICAgICAgICAgIGlmIChwaWVjZSA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgc3F1YXJlICs9IDg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0RpZ2l0KHBpZWNlKSkge1xuICAgICAgICAgICAgICAgIHNxdWFyZSArPSBwYXJzZUludChwaWVjZSwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBwaWVjZSA8ICdhJyA/IFdISVRFIDogQkxBQ0s7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHV0KHsgdHlwZTogcGllY2UudG9Mb3dlckNhc2UoKSwgY29sb3IgfSwgYWxnZWJyYWljKHNxdWFyZSkpO1xuICAgICAgICAgICAgICAgIHNxdWFyZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3R1cm4gPSB0b2tlbnNbMV07XG4gICAgICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignSycpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLncgfD0gQklUUy5LU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdRJykgPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmcudyB8PSBCSVRTLlFTSURFX0NBU1RMRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ2snKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZy5iIHw9IEJJVFMuS1NJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZigncScpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLmIgfD0gQklUUy5RU0lERV9DQVNUTEU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSB0b2tlbnNbM10gPT09ICctJyA/IEVNUFRZIDogT3g4OFt0b2tlbnNbM11dO1xuICAgICAgICB0aGlzLl9oYWxmTW92ZXMgPSBwYXJzZUludCh0b2tlbnNbNF0sIDEwKTtcbiAgICAgICAgdGhpcy5fbW92ZU51bWJlciA9IHBhcnNlSW50KHRva2Vuc1s1XSwgMTApO1xuICAgICAgICB0aGlzLl91cGRhdGVTZXR1cChmZW4pO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbkNvdW50c1tmZW5dKys7XG4gICAgfVxuICAgIGZlbigpIHtcbiAgICAgICAgbGV0IGVtcHR5ID0gMDtcbiAgICAgICAgbGV0IGZlbiA9ICcnO1xuICAgICAgICBmb3IgKGxldCBpID0gT3g4OC5hODsgaSA8PSBPeDg4LmgxOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFtpXSkge1xuICAgICAgICAgICAgICAgIGlmIChlbXB0eSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmVuICs9IGVtcHR5O1xuICAgICAgICAgICAgICAgICAgICBlbXB0eSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgY29sb3IsIHR5cGU6IHBpZWNlIH0gPSB0aGlzLl9ib2FyZFtpXTtcbiAgICAgICAgICAgICAgICBmZW4gKz0gY29sb3IgPT09IFdISVRFID8gcGllY2UudG9VcHBlckNhc2UoKSA6IHBpZWNlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbXB0eSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGVtcHR5ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmZW4gKz0gZW1wdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpICE9PSBPeDg4LmgxKSB7XG4gICAgICAgICAgICAgICAgICAgIGZlbiArPSAnLyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVtcHR5ID0gMDtcbiAgICAgICAgICAgICAgICBpICs9IDg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNhc3RsaW5nID0gJyc7XG4gICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1tXSElURV0gJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgY2FzdGxpbmcgKz0gJ0snO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1tXSElURV0gJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgY2FzdGxpbmcgKz0gJ1EnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1tCTEFDS10gJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgY2FzdGxpbmcgKz0gJ2snO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1tCTEFDS10gJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgY2FzdGxpbmcgKz0gJ3EnO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRvIHdlIGhhdmUgYW4gZW1wdHkgY2FzdGxpbmcgZmxhZz9cbiAgICAgICAgY2FzdGxpbmcgPSBjYXN0bGluZyB8fCAnLSc7XG4gICAgICAgIGxldCBlcFNxdWFyZSA9ICctJztcbiAgICAgICAgLypcbiAgICAgICAgICogb25seSBwcmludCB0aGUgZXAgc3F1YXJlIGlmIGVuIHBhc3NhbnQgaXMgYSB2YWxpZCBtb3ZlIChwYXduIGlzIHByZXNlbnRcbiAgICAgICAgICogYW5kIGVwIGNhcHR1cmUgaXMgbm90IHBpbm5lZClcbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLl9lcFNxdWFyZSAhPT0gRU1QVFkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJpZ1Bhd25TcXVhcmUgPSB0aGlzLl9lcFNxdWFyZSArICh0aGlzLl90dXJuID09PSBXSElURSA/IDE2IDogLTE2KTtcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZXMgPSBbYmlnUGF3blNxdWFyZSArIDEsIGJpZ1Bhd25TcXVhcmUgLSAxXTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc3F1YXJlIG9mIHNxdWFyZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGUgc3F1YXJlIG9mZiB0aGUgYm9hcmQ/XG4gICAgICAgICAgICAgICAgaWYgKHNxdWFyZSAmIDB4ODgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5fdHVybjtcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGVyZSBhIHBhd24gdGhhdCBjYW4gY2FwdHVyZSB0aGUgZXBTcXVhcmU/XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW3NxdWFyZV0/LmNvbG9yID09PSBjb2xvciAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZFtzcXVhcmVdPy50eXBlID09PSBQQVdOKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwYXduIG1ha2VzIGFuIGVwIGNhcHR1cmUsIGRvZXMgaXQgbGVhdmUgaXQncyBraW5nIGluIGNoZWNrP1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYWtlTW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHNxdWFyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB0aGlzLl9lcFNxdWFyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlOiBQQVdOLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FwdHVyZWQ6IFBBV04sXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnczogQklUUy5FUF9DQVBUVVJFLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNMZWdhbCA9ICF0aGlzLl9pc0tpbmdBdHRhY2tlZChjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VuZG9Nb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGVwIGlzIGxlZ2FsLCBicmVhayBhbmQgc2V0IHRoZSBlcCBzcXVhcmUgaW4gdGhlIEZFTiBvdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTGVnYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVwU3F1YXJlID0gYWxnZWJyYWljKHRoaXMuX2VwU3F1YXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBmZW4sXG4gICAgICAgICAgICB0aGlzLl90dXJuLFxuICAgICAgICAgICAgY2FzdGxpbmcsXG4gICAgICAgICAgICBlcFNxdWFyZSxcbiAgICAgICAgICAgIHRoaXMuX2hhbGZNb3ZlcyxcbiAgICAgICAgICAgIHRoaXMuX21vdmVOdW1iZXIsXG4gICAgICAgIF0uam9pbignICcpO1xuICAgIH1cbiAgICAvKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBpbml0aWFsIGJvYXJkIHNldHVwIGlzIGNoYW5nZWQgd2l0aCBwdXQoKSBvciByZW1vdmUoKS5cbiAgICAgKiBtb2RpZmllcyB0aGUgU2V0VXAgYW5kIEZFTiBwcm9wZXJ0aWVzIG9mIHRoZSBoZWFkZXIgb2JqZWN0LiBJZiB0aGUgRkVOXG4gICAgICogaXMgZXF1YWwgdG8gdGhlIGRlZmF1bHQgcG9zaXRpb24sIHRoZSBTZXRVcCBhbmQgRkVOIGFyZSBkZWxldGVkIHRoZSBzZXR1cFxuICAgICAqIGlzIG9ubHkgdXBkYXRlZCBpZiBoaXN0b3J5Lmxlbmd0aCBpcyB6ZXJvLCBpZSBtb3ZlcyBoYXZlbid0IGJlZW4gbWFkZS5cbiAgICAgKi9cbiAgICBfdXBkYXRlU2V0dXAoZmVuKSB7XG4gICAgICAgIGlmICh0aGlzLl9oaXN0b3J5Lmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChmZW4gIT09IERFRkFVTFRfUE9TSVRJT04pIHtcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlclsnU2V0VXAnXSA9ICcxJztcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlclsnRkVOJ10gPSBmZW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5faGVhZGVyWydTZXRVcCddO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlclsnRkVOJ107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMubG9hZChERUZBVUxUX1BPU0lUSU9OKTtcbiAgICB9XG4gICAgZ2V0KHNxdWFyZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9hcmRbT3g4OFtzcXVhcmVdXSB8fCBmYWxzZTtcbiAgICB9XG4gICAgcHV0KHsgdHlwZSwgY29sb3IgfSwgc3F1YXJlKSB7XG4gICAgICAgIGlmICh0aGlzLl9wdXQoeyB0eXBlLCBjb2xvciB9LCBzcXVhcmUpKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDYXN0bGluZ1JpZ2h0cygpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRW5QYXNzYW50U3F1YXJlKCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTZXR1cCh0aGlzLmZlbigpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgX3B1dCh7IHR5cGUsIGNvbG9yIH0sIHNxdWFyZSkge1xuICAgICAgICAvLyBjaGVjayBmb3IgcGllY2VcbiAgICAgICAgaWYgKFNZTUJPTFMuaW5kZXhPZih0eXBlLnRvTG93ZXJDYXNlKCkpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIGZvciB2YWxpZCBzcXVhcmVcbiAgICAgICAgaWYgKCEoc3F1YXJlIGluIE94ODgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3EgPSBPeDg4W3NxdWFyZV07XG4gICAgICAgIC8vIGRvbid0IGxldCB0aGUgdXNlciBwbGFjZSBtb3JlIHRoYW4gb25lIGtpbmdcbiAgICAgICAgaWYgKHR5cGUgPT0gS0lORyAmJlxuICAgICAgICAgICAgISh0aGlzLl9raW5nc1tjb2xvcl0gPT0gRU1QVFkgfHwgdGhpcy5fa2luZ3NbY29sb3JdID09IHNxKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQaWVjZU9uU3F1YXJlID0gdGhpcy5fYm9hcmRbc3FdO1xuICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIGtpbmdzIHdpbGwgYmUgcmVwbGFjZWQgYnkgdGhlIHBpZWNlIGZyb20gYXJncywgc2V0IHRoZSBgX2tpbmdzYCByZXNwZWN0aXZlIGVudHJ5IHRvIGBFTVBUWWBcbiAgICAgICAgaWYgKGN1cnJlbnRQaWVjZU9uU3F1YXJlICYmIGN1cnJlbnRQaWVjZU9uU3F1YXJlLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgICAgICAgIHRoaXMuX2tpbmdzW2N1cnJlbnRQaWVjZU9uU3F1YXJlLmNvbG9yXSA9IEVNUFRZO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2JvYXJkW3NxXSA9IHsgdHlwZTogdHlwZSwgY29sb3I6IGNvbG9yIH07XG4gICAgICAgIGlmICh0eXBlID09PSBLSU5HKSB7XG4gICAgICAgICAgICB0aGlzLl9raW5nc1tjb2xvcl0gPSBzcTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmVtb3ZlKHNxdWFyZSkge1xuICAgICAgICBjb25zdCBwaWVjZSA9IHRoaXMuZ2V0KHNxdWFyZSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFtPeDg4W3NxdWFyZV1dO1xuICAgICAgICBpZiAocGllY2UgJiYgcGllY2UudHlwZSA9PT0gS0lORykge1xuICAgICAgICAgICAgdGhpcy5fa2luZ3NbcGllY2UuY29sb3JdID0gRU1QVFk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlQ2FzdGxpbmdSaWdodHMoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlRW5QYXNzYW50U3F1YXJlKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNldHVwKHRoaXMuZmVuKCkpO1xuICAgICAgICByZXR1cm4gcGllY2U7XG4gICAgfVxuICAgIF91cGRhdGVDYXN0bGluZ1JpZ2h0cygpIHtcbiAgICAgICAgY29uc3Qgd2hpdGVLaW5nSW5QbGFjZSA9IHRoaXMuX2JvYXJkW094ODguZTFdPy50eXBlID09PSBLSU5HICYmXG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtPeDg4LmUxXT8uY29sb3IgPT09IFdISVRFO1xuICAgICAgICBjb25zdCBibGFja0tpbmdJblBsYWNlID0gdGhpcy5fYm9hcmRbT3g4OC5lOF0/LnR5cGUgPT09IEtJTkcgJiZcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguZThdPy5jb2xvciA9PT0gQkxBQ0s7XG4gICAgICAgIGlmICghd2hpdGVLaW5nSW5QbGFjZSB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5hMV0/LnR5cGUgIT09IFJPT0sgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguYTFdPy5jb2xvciAhPT0gV0hJVEUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLncgJj0gfkJJVFMuUVNJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgICAgIGlmICghd2hpdGVLaW5nSW5QbGFjZSB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5oMV0/LnR5cGUgIT09IFJPT0sgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguaDFdPy5jb2xvciAhPT0gV0hJVEUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLncgJj0gfkJJVFMuS1NJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmxhY2tLaW5nSW5QbGFjZSB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5hOF0/LnR5cGUgIT09IFJPT0sgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguYThdPy5jb2xvciAhPT0gQkxBQ0spIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLmIgJj0gfkJJVFMuUVNJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmxhY2tLaW5nSW5QbGFjZSB8fFxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbT3g4OC5oOF0/LnR5cGUgIT09IFJPT0sgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW094ODguaDhdPy5jb2xvciAhPT0gQkxBQ0spIHtcbiAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nLmIgJj0gfkJJVFMuS1NJREVfQ0FTVExFO1xuICAgICAgICB9XG4gICAgfVxuICAgIF91cGRhdGVFblBhc3NhbnRTcXVhcmUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9lcFNxdWFyZSA9PT0gRU1QVFkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydFNxdWFyZSA9IHRoaXMuX2VwU3F1YXJlICsgKHRoaXMuX3R1cm4gPT09IFdISVRFID8gLTE2IDogMTYpO1xuICAgICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gdGhpcy5fZXBTcXVhcmUgKyAodGhpcy5fdHVybiA9PT0gV0hJVEUgPyAxNiA6IC0xNik7XG4gICAgICAgIGNvbnN0IGF0dGFja2VycyA9IFtjdXJyZW50U3F1YXJlICsgMSwgY3VycmVudFNxdWFyZSAtIDFdO1xuICAgICAgICBpZiAodGhpcy5fYm9hcmRbc3RhcnRTcXVhcmVdICE9PSBudWxsIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFt0aGlzLl9lcFNxdWFyZV0gIT09IG51bGwgfHxcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW2N1cnJlbnRTcXVhcmVdPy5jb2xvciAhPT0gc3dhcENvbG9yKHRoaXMuX3R1cm4pIHx8XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtjdXJyZW50U3F1YXJlXT8udHlwZSAhPT0gUEFXTikge1xuICAgICAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSBFTVBUWTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjYW5DYXB0dXJlID0gKHNxdWFyZSkgPT4gIShzcXVhcmUgJiAweDg4KSAmJlxuICAgICAgICAgICAgdGhpcy5fYm9hcmRbc3F1YXJlXT8uY29sb3IgPT09IHRoaXMuX3R1cm4gJiZcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW3NxdWFyZV0/LnR5cGUgPT09IFBBV047XG4gICAgICAgIGlmICghYXR0YWNrZXJzLnNvbWUoY2FuQ2FwdHVyZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2VwU3F1YXJlID0gRU1QVFk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2F0dGFja2VkKGNvbG9yLCBzcXVhcmUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IE94ODguYTg7IGkgPD0gT3g4OC5oMTsgaSsrKSB7XG4gICAgICAgICAgICAvLyBkaWQgd2UgcnVuIG9mZiB0aGUgZW5kIG9mIHRoZSBib2FyZFxuICAgICAgICAgICAgaWYgKGkgJiAweDg4KSB7XG4gICAgICAgICAgICAgICAgaSArPSA3O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgZW1wdHkgc3F1YXJlIG9yIHdyb25nIGNvbG9yXG4gICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbaV0gPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9ib2FyZFtpXS5jb2xvciAhPT0gY29sb3IpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBpZWNlID0gdGhpcy5fYm9hcmRbaV07XG4gICAgICAgICAgICBjb25zdCBkaWZmZXJlbmNlID0gaSAtIHNxdWFyZTtcbiAgICAgICAgICAgIC8vIHNraXAgLSB0by9mcm9tIHNxdWFyZSBhcmUgdGhlIHNhbWVcbiAgICAgICAgICAgIGlmIChkaWZmZXJlbmNlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGRpZmZlcmVuY2UgKyAxMTk7XG4gICAgICAgICAgICBpZiAoQVRUQUNLU1tpbmRleF0gJiBQSUVDRV9NQVNLU1twaWVjZS50eXBlXSkge1xuICAgICAgICAgICAgICAgIGlmIChwaWVjZS50eXBlID09PSBQQVdOKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWZmZXJlbmNlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBpZWNlLmNvbG9yID09PSBXSElURSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwaWVjZS5jb2xvciA9PT0gQkxBQ0spXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwaWVjZSBpcyBhIGtuaWdodCBvciBhIGtpbmdcbiAgICAgICAgICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gJ24nIHx8IHBpZWNlLnR5cGUgPT09ICdrJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gUkFZU1tpbmRleF07XG4gICAgICAgICAgICAgICAgbGV0IGogPSBpICsgb2Zmc2V0O1xuICAgICAgICAgICAgICAgIGxldCBibG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGogIT09IHNxdWFyZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbal0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBqICs9IG9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFibG9ja2VkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9pc0tpbmdBdHRhY2tlZChjb2xvcikge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSB0aGlzLl9raW5nc1tjb2xvcl07XG4gICAgICAgIHJldHVybiBzcXVhcmUgPT09IC0xID8gZmFsc2UgOiB0aGlzLl9hdHRhY2tlZChzd2FwQ29sb3IoY29sb3IpLCBzcXVhcmUpO1xuICAgIH1cbiAgICBpc0F0dGFja2VkKHNxdWFyZSwgYXR0YWNrZWRCeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNrZWQoYXR0YWNrZWRCeSwgT3g4OFtzcXVhcmVdKTtcbiAgICB9XG4gICAgaXNDaGVjaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzS2luZ0F0dGFja2VkKHRoaXMuX3R1cm4pO1xuICAgIH1cbiAgICBpbkNoZWNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0NoZWNrKCk7XG4gICAgfVxuICAgIGlzQ2hlY2ttYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0NoZWNrKCkgJiYgdGhpcy5fbW92ZXMoKS5sZW5ndGggPT09IDA7XG4gICAgfVxuICAgIGlzU3RhbGVtYXRlKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNDaGVjaygpICYmIHRoaXMuX21vdmVzKCkubGVuZ3RoID09PSAwO1xuICAgIH1cbiAgICBpc0luc3VmZmljaWVudE1hdGVyaWFsKCkge1xuICAgICAgICAvKlxuICAgICAgICAgKiBrLmIuIHZzIGsuYi4gKG9mIG9wcG9zaXRlIGNvbG9ycykgd2l0aCBtYXRlIGluIDE6XG4gICAgICAgICAqIDgvOC84LzgvMWI2LzgvQjFrNS9LNyBiIC0gLSAwIDFcbiAgICAgICAgICpcbiAgICAgICAgICogay5iLiB2cyBrLm4uIHdpdGggbWF0ZSBpbiAxOlxuICAgICAgICAgKiA4LzgvOC84LzFuNi84L0I3L0sxazUgYiAtIC0gMiAxXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBwaWVjZXMgPSB7XG4gICAgICAgICAgICBiOiAwLFxuICAgICAgICAgICAgbjogMCxcbiAgICAgICAgICAgIHI6IDAsXG4gICAgICAgICAgICBxOiAwLFxuICAgICAgICAgICAgazogMCxcbiAgICAgICAgICAgIHA6IDAsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGJpc2hvcHMgPSBbXTtcbiAgICAgICAgbGV0IG51bVBpZWNlcyA9IDA7XG4gICAgICAgIGxldCBzcXVhcmVDb2xvciA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSBPeDg4LmE4OyBpIDw9IE94ODguaDE7IGkrKykge1xuICAgICAgICAgICAgc3F1YXJlQ29sb3IgPSAoc3F1YXJlQ29sb3IgKyAxKSAlIDI7XG4gICAgICAgICAgICBpZiAoaSAmIDB4ODgpIHtcbiAgICAgICAgICAgICAgICBpICs9IDc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwaWVjZSA9IHRoaXMuX2JvYXJkW2ldO1xuICAgICAgICAgICAgaWYgKHBpZWNlKSB7XG4gICAgICAgICAgICAgICAgcGllY2VzW3BpZWNlLnR5cGVdID0gcGllY2UudHlwZSBpbiBwaWVjZXMgPyBwaWVjZXNbcGllY2UudHlwZV0gKyAxIDogMTtcbiAgICAgICAgICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gQklTSE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpc2hvcHMucHVzaChzcXVhcmVDb2xvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG51bVBpZWNlcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGsgdnMuIGtcbiAgICAgICAgaWYgKG51bVBpZWNlcyA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgIC8vIGsgdnMuIGtuIC4uLi4gb3IgLi4uLiBrIHZzLiBrYlxuICAgICAgICBudW1QaWVjZXMgPT09IDMgJiZcbiAgICAgICAgICAgIChwaWVjZXNbQklTSE9QXSA9PT0gMSB8fCBwaWVjZXNbS05JR0hUXSA9PT0gMSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG51bVBpZWNlcyA9PT0gcGllY2VzW0JJU0hPUF0gKyAyKSB7XG4gICAgICAgICAgICAvLyBrYiB2cy4ga2Igd2hlcmUgYW55IG51bWJlciBvZiBiaXNob3BzIGFyZSBhbGwgb24gdGhlIHNhbWUgY29sb3JcbiAgICAgICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gYmlzaG9wcy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3VtICs9IGJpc2hvcHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3VtID09PSAwIHx8IHN1bSA9PT0gbGVuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBfZ2V0UmVwZXRpdGlvbkNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25Db3VudHNbdGhpcy5mZW4oKV07XG4gICAgfVxuICAgIGlzVGhyZWVmb2xkUmVwZXRpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFJlcGV0aXRpb25Db3VudCgpID49IDM7XG4gICAgfVxuICAgIGlzRHJhdygpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9oYWxmTW92ZXMgPj0gMTAwIHx8IC8vIDUwIG1vdmVzIHBlciBzaWRlID0gMTAwIGhhbGYgbW92ZXNcbiAgICAgICAgICAgIHRoaXMuaXNTdGFsZW1hdGUoKSB8fFxuICAgICAgICAgICAgdGhpcy5pc0luc3VmZmljaWVudE1hdGVyaWFsKCkgfHxcbiAgICAgICAgICAgIHRoaXMuaXNUaHJlZWZvbGRSZXBldGl0aW9uKCkpO1xuICAgIH1cbiAgICBpc0dhbWVPdmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0NoZWNrbWF0ZSgpIHx8IHRoaXMuaXNTdGFsZW1hdGUoKSB8fCB0aGlzLmlzRHJhdygpO1xuICAgIH1cbiAgICBtb3Zlcyh7IHZlcmJvc2UgPSBmYWxzZSwgc3F1YXJlID0gdW5kZWZpbmVkLCBwaWVjZSA9IHVuZGVmaW5lZCwgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IG1vdmVzID0gdGhpcy5fbW92ZXMoeyBzcXVhcmUsIHBpZWNlIH0pO1xuICAgICAgICBpZiAodmVyYm9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vdmVzLm1hcCgobW92ZSkgPT4gdGhpcy5fbWFrZVByZXR0eShtb3ZlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW92ZXMubWFwKChtb3ZlKSA9PiB0aGlzLl9tb3ZlVG9TYW4obW92ZSwgbW92ZXMpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfbW92ZXMoeyBsZWdhbCA9IHRydWUsIHBpZWNlID0gdW5kZWZpbmVkLCBzcXVhcmUgPSB1bmRlZmluZWQsIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBmb3JTcXVhcmUgPSBzcXVhcmUgPyBzcXVhcmUudG9Mb3dlckNhc2UoKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgZm9yUGllY2UgPSBwaWVjZT8udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgbW92ZXMgPSBbXTtcbiAgICAgICAgY29uc3QgdXMgPSB0aGlzLl90dXJuO1xuICAgICAgICBjb25zdCB0aGVtID0gc3dhcENvbG9yKHVzKTtcbiAgICAgICAgbGV0IGZpcnN0U3F1YXJlID0gT3g4OC5hODtcbiAgICAgICAgbGV0IGxhc3RTcXVhcmUgPSBPeDg4LmgxO1xuICAgICAgICBsZXQgc2luZ2xlU3F1YXJlID0gZmFsc2U7XG4gICAgICAgIC8vIGFyZSB3ZSBnZW5lcmF0aW5nIG1vdmVzIGZvciBhIHNpbmdsZSBzcXVhcmU/XG4gICAgICAgIGlmIChmb3JTcXVhcmUpIHtcbiAgICAgICAgICAgIC8vIGlsbGVnYWwgc3F1YXJlLCByZXR1cm4gZW1wdHkgbW92ZXNcbiAgICAgICAgICAgIGlmICghKGZvclNxdWFyZSBpbiBPeDg4KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpcnN0U3F1YXJlID0gbGFzdFNxdWFyZSA9IE94ODhbZm9yU3F1YXJlXTtcbiAgICAgICAgICAgICAgICBzaW5nbGVTcXVhcmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGZyb20gPSBmaXJzdFNxdWFyZTsgZnJvbSA8PSBsYXN0U3F1YXJlOyBmcm9tKyspIHtcbiAgICAgICAgICAgIC8vIGRpZCB3ZSBydW4gb2ZmIHRoZSBlbmQgb2YgdGhlIGJvYXJkXG4gICAgICAgICAgICBpZiAoZnJvbSAmIDB4ODgpIHtcbiAgICAgICAgICAgICAgICBmcm9tICs9IDc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbXB0eSBzcXVhcmUgb3Igb3Bwb25lbnQsIHNraXBcbiAgICAgICAgICAgIGlmICghdGhpcy5fYm9hcmRbZnJvbV0gfHwgdGhpcy5fYm9hcmRbZnJvbV0uY29sb3IgPT09IHRoZW0pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5fYm9hcmRbZnJvbV07XG4gICAgICAgICAgICBsZXQgdG87XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gUEFXTikge1xuICAgICAgICAgICAgICAgIGlmIChmb3JQaWVjZSAmJiBmb3JQaWVjZSAhPT0gdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gc2luZ2xlIHNxdWFyZSwgbm9uLWNhcHR1cmluZ1xuICAgICAgICAgICAgICAgIHRvID0gZnJvbSArIFBBV05fT0ZGU0VUU1t1c11bMF07XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ib2FyZFt0b10pIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIGZyb20sIHRvLCBQQVdOKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG91YmxlIHNxdWFyZVxuICAgICAgICAgICAgICAgICAgICB0byA9IGZyb20gKyBQQVdOX09GRlNFVFNbdXNdWzFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoU0VDT05EX1JBTktbdXNdID09PSByYW5rKGZyb20pICYmICF0aGlzLl9ib2FyZFt0b10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCBmcm9tLCB0bywgUEFXTiwgdW5kZWZpbmVkLCBCSVRTLkJJR19QQVdOKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBwYXduIGNhcHR1cmVzXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDI7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBmcm9tICsgUEFXTl9PRkZTRVRTW3VzXVtqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvICYgMHg4OClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbdG9dPy5jb2xvciA9PT0gdGhlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIGZyb20sIHRvLCBQQVdOLCB0aGlzLl9ib2FyZFt0b10udHlwZSwgQklUUy5DQVBUVVJFKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0byA9PT0gdGhpcy5fZXBTcXVhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCBmcm9tLCB0bywgUEFXTiwgUEFXTiwgQklUUy5FUF9DQVBUVVJFKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChmb3JQaWVjZSAmJiBmb3JQaWVjZSAhPT0gdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IFBJRUNFX09GRlNFVFNbdHlwZV0ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gUElFQ0VfT0ZGU0VUU1t0eXBlXVtqXTtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBmcm9tO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG8gKz0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvICYgMHg4OClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fYm9hcmRbdG9dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIGZyb20sIHRvLCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG93biBjb2xvciwgc3RvcCBsb29wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JvYXJkW3RvXS5jb2xvciA9PT0gdXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCBmcm9tLCB0bywgdHlwZSwgdGhpcy5fYm9hcmRbdG9dLnR5cGUsIEJJVFMuQ0FQVFVSRSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBicmVhaywgaWYga25pZ2h0IG9yIGtpbmcgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBLTklHSFQgfHwgdHlwZSA9PT0gS0lORylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBjaGVjayBmb3IgY2FzdGxpbmcgaWYgd2UncmU6XG4gICAgICAgICAqICAgYSkgZ2VuZXJhdGluZyBhbGwgbW92ZXMsIG9yXG4gICAgICAgICAqICAgYikgZG9pbmcgc2luZ2xlIHNxdWFyZSBtb3ZlIGdlbmVyYXRpb24gb24gdGhlIGtpbmcncyBzcXVhcmVcbiAgICAgICAgICovXG4gICAgICAgIGlmIChmb3JQaWVjZSA9PT0gdW5kZWZpbmVkIHx8IGZvclBpZWNlID09PSBLSU5HKSB7XG4gICAgICAgICAgICBpZiAoIXNpbmdsZVNxdWFyZSB8fCBsYXN0U3F1YXJlID09PSB0aGlzLl9raW5nc1t1c10pIHtcbiAgICAgICAgICAgICAgICAvLyBraW5nLXNpZGUgY2FzdGxpbmdcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbdXNdICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdGcm9tID0gdGhpcy5fa2luZ3NbdXNdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ1RvID0gY2FzdGxpbmdGcm9tICsgMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb20gKyAxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2JvYXJkW2Nhc3RsaW5nVG9dICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYXR0YWNrZWQodGhlbSwgdGhpcy5fa2luZ3NbdXNdKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2F0dGFja2VkKHRoZW0sIGNhc3RsaW5nRnJvbSArIDEpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdUbykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZE1vdmUobW92ZXMsIHVzLCB0aGlzLl9raW5nc1t1c10sIGNhc3RsaW5nVG8sIEtJTkcsIHVuZGVmaW5lZCwgQklUUy5LU0lERV9DQVNUTEUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHF1ZWVuLXNpZGUgY2FzdGxpbmdcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FzdGxpbmdbdXNdICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdGcm9tID0gdGhpcy5fa2luZ3NbdXNdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ1RvID0gY2FzdGxpbmdGcm9tIC0gMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb20gLSAxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbSAtIDJdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tIC0gM10gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9hdHRhY2tlZCh0aGVtLCB0aGlzLl9raW5nc1t1c10pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdGcm9tIC0gMSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLl9hdHRhY2tlZCh0aGVtLCBjYXN0bGluZ1RvKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkTW92ZShtb3ZlcywgdXMsIHRoaXMuX2tpbmdzW3VzXSwgY2FzdGxpbmdUbywgS0lORywgdW5kZWZpbmVkLCBCSVRTLlFTSURFX0NBU1RMRSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogcmV0dXJuIGFsbCBwc2V1ZG8tbGVnYWwgbW92ZXMgKHRoaXMgaW5jbHVkZXMgbW92ZXMgdGhhdCBhbGxvdyB0aGUga2luZ1xuICAgICAgICAgKiB0byBiZSBjYXB0dXJlZClcbiAgICAgICAgICovXG4gICAgICAgIGlmICghbGVnYWwgfHwgdGhpcy5fa2luZ3NbdXNdID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vdmVzO1xuICAgICAgICB9XG4gICAgICAgIC8vIGZpbHRlciBvdXQgaWxsZWdhbCBtb3Zlc1xuICAgICAgICBjb25zdCBsZWdhbE1vdmVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZXNbaV0pO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0tpbmdBdHRhY2tlZCh1cykpIHtcbiAgICAgICAgICAgICAgICBsZWdhbE1vdmVzLnB1c2gobW92ZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdW5kb01vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGVnYWxNb3ZlcztcbiAgICB9XG4gICAgbW92ZShtb3ZlLCB7IHN0cmljdCA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICAvKlxuICAgICAgICAgKiBUaGUgbW92ZSBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIHdpdGggaW4gdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgICAgICAgKlxuICAgICAgICAgKiAubW92ZSgnTnhiNycpICAgICAgIDwtIGFyZ3VtZW50IGlzIGEgY2FzZS1zZW5zaXRpdmUgU0FOIHN0cmluZ1xuICAgICAgICAgKlxuICAgICAgICAgKiAubW92ZSh7IGZyb206ICdoNycsIDwtIGFyZ3VtZW50IGlzIGEgbW92ZSBvYmplY3RcbiAgICAgICAgICogICAgICAgICB0byA6J2g4JyxcbiAgICAgICAgICogICAgICAgICBwcm9tb3Rpb246ICdxJyB9KVxuICAgICAgICAgKlxuICAgICAgICAgKlxuICAgICAgICAgKiBBbiBvcHRpb25hbCBzdHJpY3QgYXJndW1lbnQgbWF5IGJlIHN1cHBsaWVkIHRvIHRlbGwgY2hlc3MuanMgdG9cbiAgICAgICAgICogc3RyaWN0bHkgZm9sbG93IHRoZSBTQU4gc3BlY2lmaWNhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGxldCBtb3ZlT2JqID0gbnVsbDtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgbW92ZU9iaiA9IHRoaXMuX21vdmVGcm9tU2FuKG1vdmUsIHN0cmljdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1vdmUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlcyA9IHRoaXMuX21vdmVzKCk7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IHRoZSBwcmV0dHkgbW92ZSBvYmplY3QgdG8gYW4gdWdseSBtb3ZlIG9iamVjdFxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUuZnJvbSA9PT0gYWxnZWJyYWljKG1vdmVzW2ldLmZyb20pICYmXG4gICAgICAgICAgICAgICAgICAgIG1vdmUudG8gPT09IGFsZ2VicmFpYyhtb3Zlc1tpXS50bykgJiZcbiAgICAgICAgICAgICAgICAgICAgKCEoJ3Byb21vdGlvbicgaW4gbW92ZXNbaV0pIHx8IG1vdmUucHJvbW90aW9uID09PSBtb3Zlc1tpXS5wcm9tb3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVPYmogPSBtb3Zlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGZhaWxlZCB0byBmaW5kIG1vdmVcbiAgICAgICAgaWYgKCFtb3ZlT2JqKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1vdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1vdmU6ICR7bW92ZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtb3ZlOiAke0pTT04uc3RyaW5naWZ5KG1vdmUpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIG5lZWQgdG8gbWFrZSBhIGNvcHkgb2YgbW92ZSBiZWNhdXNlIHdlIGNhbid0IGdlbmVyYXRlIFNBTiBhZnRlciB0aGUgbW92ZVxuICAgICAgICAgKiBpcyBtYWRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBwcmV0dHlNb3ZlID0gdGhpcy5fbWFrZVByZXR0eShtb3ZlT2JqKTtcbiAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZU9iaik7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uQ291bnRzW3ByZXR0eU1vdmUuYWZ0ZXJdKys7XG4gICAgICAgIHJldHVybiBwcmV0dHlNb3ZlO1xuICAgIH1cbiAgICBfcHVzaChtb3ZlKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkucHVzaCh7XG4gICAgICAgICAgICBtb3ZlLFxuICAgICAgICAgICAga2luZ3M6IHsgYjogdGhpcy5fa2luZ3MuYiwgdzogdGhpcy5fa2luZ3MudyB9LFxuICAgICAgICAgICAgdHVybjogdGhpcy5fdHVybixcbiAgICAgICAgICAgIGNhc3RsaW5nOiB7IGI6IHRoaXMuX2Nhc3RsaW5nLmIsIHc6IHRoaXMuX2Nhc3RsaW5nLncgfSxcbiAgICAgICAgICAgIGVwU3F1YXJlOiB0aGlzLl9lcFNxdWFyZSxcbiAgICAgICAgICAgIGhhbGZNb3ZlczogdGhpcy5faGFsZk1vdmVzLFxuICAgICAgICAgICAgbW92ZU51bWJlcjogdGhpcy5fbW92ZU51bWJlcixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9tYWtlTW92ZShtb3ZlKSB7XG4gICAgICAgIGNvbnN0IHVzID0gdGhpcy5fdHVybjtcbiAgICAgICAgY29uc3QgdGhlbSA9IHN3YXBDb2xvcih1cyk7XG4gICAgICAgIHRoaXMuX3B1c2gobW92ZSk7XG4gICAgICAgIHRoaXMuX2JvYXJkW21vdmUudG9dID0gdGhpcy5fYm9hcmRbbW92ZS5mcm9tXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW21vdmUuZnJvbV07XG4gICAgICAgIC8vIGlmIGVwIGNhcHR1cmUsIHJlbW92ZSB0aGUgY2FwdHVyZWQgcGF3blxuICAgICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuRVBfQ0FQVFVSRSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3R1cm4gPT09IEJMQUNLKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW21vdmUudG8gLSAxNl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbbW92ZS50byArIDE2XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBwYXduIHByb21vdGlvbiwgcmVwbGFjZSB3aXRoIG5ldyBwaWVjZVxuICAgICAgICBpZiAobW92ZS5wcm9tb3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvYXJkW21vdmUudG9dID0geyB0eXBlOiBtb3ZlLnByb21vdGlvbiwgY29sb3I6IHVzIH07XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgd2UgbW92ZWQgdGhlIGtpbmdcbiAgICAgICAgaWYgKHRoaXMuX2JvYXJkW21vdmUudG9dLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgICAgICAgIHRoaXMuX2tpbmdzW3VzXSA9IG1vdmUudG87XG4gICAgICAgICAgICAvLyBpZiB3ZSBjYXN0bGVkLCBtb3ZlIHRoZSByb29rIG5leHQgdG8gdGhlIGtpbmdcbiAgICAgICAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXN0bGluZ1RvID0gbW92ZS50byAtIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdGcm9tID0gbW92ZS50byArIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5fYm9hcmRbY2FzdGxpbmdUb10gPSB0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb21dO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ib2FyZFtjYXN0bGluZ0Zyb21dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FzdGxpbmdUbyA9IG1vdmUudG8gKyAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhc3RsaW5nRnJvbSA9IG1vdmUudG8gLSAyO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvYXJkW2Nhc3RsaW5nVG9dID0gdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHR1cm4gb2ZmIGNhc3RsaW5nXG4gICAgICAgICAgICB0aGlzLl9jYXN0bGluZ1t1c10gPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIHR1cm4gb2ZmIGNhc3RsaW5nIGlmIHdlIG1vdmUgYSByb29rXG4gICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1t1c10pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBST09LU1t1c10ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5mcm9tID09PSBST09LU1t1c11baV0uc3F1YXJlICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nW3VzXSAmIFJPT0tTW3VzXVtpXS5mbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nhc3RsaW5nW3VzXSBePSBST09LU1t1c11baV0uZmxhZztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHR1cm4gb2ZmIGNhc3RsaW5nIGlmIHdlIGNhcHR1cmUgYSByb29rXG4gICAgICAgIGlmICh0aGlzLl9jYXN0bGluZ1t0aGVtXSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IFJPT0tTW3RoZW1dLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUudG8gPT09IFJPT0tTW3RoZW1dW2ldLnNxdWFyZSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXN0bGluZ1t0aGVtXSAmIFJPT0tTW3RoZW1dW2ldLmZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmdbdGhlbV0gXj0gUk9PS1NbdGhlbV1baV0uZmxhZztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIGJpZyBwYXduIG1vdmUsIHVwZGF0ZSB0aGUgZW4gcGFzc2FudCBzcXVhcmVcbiAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkJJR19QQVdOKSB7XG4gICAgICAgICAgICBpZiAodXMgPT09IEJMQUNLKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXBTcXVhcmUgPSBtb3ZlLnRvIC0gMTY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IG1vdmUudG8gKyAxNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2VwU3F1YXJlID0gRU1QVFk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVzZXQgdGhlIDUwIG1vdmUgY291bnRlciBpZiBhIHBhd24gaXMgbW92ZWQgb3IgYSBwaWVjZSBpcyBjYXB0dXJlZFxuICAgICAgICBpZiAobW92ZS5waWVjZSA9PT0gUEFXTikge1xuICAgICAgICAgICAgdGhpcy5faGFsZk1vdmVzID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbGZNb3ZlcyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9oYWxmTW92ZXMrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAodXMgPT09IEJMQUNLKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlTnVtYmVyKys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdHVybiA9IHRoZW07XG4gICAgfVxuICAgIHVuZG8oKSB7XG4gICAgICAgIGNvbnN0IG1vdmUgPSB0aGlzLl91bmRvTW92ZSgpO1xuICAgICAgICBpZiAobW92ZSkge1xuICAgICAgICAgICAgY29uc3QgcHJldHR5TW92ZSA9IHRoaXMuX21ha2VQcmV0dHkobW92ZSk7XG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvbkNvdW50c1twcmV0dHlNb3ZlLmFmdGVyXS0tO1xuICAgICAgICAgICAgcmV0dXJuIHByZXR0eU1vdmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIF91bmRvTW92ZSgpIHtcbiAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5faGlzdG9yeS5wb3AoKTtcbiAgICAgICAgaWYgKG9sZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb3ZlID0gb2xkLm1vdmU7XG4gICAgICAgIHRoaXMuX2tpbmdzID0gb2xkLmtpbmdzO1xuICAgICAgICB0aGlzLl90dXJuID0gb2xkLnR1cm47XG4gICAgICAgIHRoaXMuX2Nhc3RsaW5nID0gb2xkLmNhc3RsaW5nO1xuICAgICAgICB0aGlzLl9lcFNxdWFyZSA9IG9sZC5lcFNxdWFyZTtcbiAgICAgICAgdGhpcy5faGFsZk1vdmVzID0gb2xkLmhhbGZNb3ZlcztcbiAgICAgICAgdGhpcy5fbW92ZU51bWJlciA9IG9sZC5tb3ZlTnVtYmVyO1xuICAgICAgICBjb25zdCB1cyA9IHRoaXMuX3R1cm47XG4gICAgICAgIGNvbnN0IHRoZW0gPSBzd2FwQ29sb3IodXMpO1xuICAgICAgICB0aGlzLl9ib2FyZFttb3ZlLmZyb21dID0gdGhpcy5fYm9hcmRbbW92ZS50b107XG4gICAgICAgIHRoaXMuX2JvYXJkW21vdmUuZnJvbV0udHlwZSA9IG1vdmUucGllY2U7IC8vIHRvIHVuZG8gYW55IHByb21vdGlvbnNcbiAgICAgICAgZGVsZXRlIHRoaXMuX2JvYXJkW21vdmUudG9dO1xuICAgICAgICBpZiAobW92ZS5jYXB0dXJlZCkge1xuICAgICAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgICAgICAgICAgICAvLyBlbiBwYXNzYW50IGNhcHR1cmVcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKHVzID09PSBCTEFDSykge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IG1vdmUudG8gLSAxNjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbW92ZS50byArIDE2O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZFtpbmRleF0gPSB7IHR5cGU6IFBBV04sIGNvbG9yOiB0aGVtIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyByZWd1bGFyIGNhcHR1cmVcbiAgICAgICAgICAgICAgICB0aGlzLl9ib2FyZFttb3ZlLnRvXSA9IHsgdHlwZTogbW92ZS5jYXB0dXJlZCwgY29sb3I6IHRoZW0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobW92ZS5mbGFncyAmIChCSVRTLktTSURFX0NBU1RMRSB8IEJJVFMuUVNJREVfQ0FTVExFKSkge1xuICAgICAgICAgICAgbGV0IGNhc3RsaW5nVG8sIGNhc3RsaW5nRnJvbTtcbiAgICAgICAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgICAgICBjYXN0bGluZ1RvID0gbW92ZS50byArIDE7XG4gICAgICAgICAgICAgICAgY2FzdGxpbmdGcm9tID0gbW92ZS50byAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYXN0bGluZ1RvID0gbW92ZS50byAtIDI7XG4gICAgICAgICAgICAgICAgY2FzdGxpbmdGcm9tID0gbW92ZS50byArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9ib2FyZFtjYXN0bGluZ1RvXSA9IHRoaXMuX2JvYXJkW2Nhc3RsaW5nRnJvbV07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fYm9hcmRbY2FzdGxpbmdGcm9tXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW92ZTtcbiAgICB9XG4gICAgcGduKHsgbmV3bGluZSA9ICdcXG4nLCBtYXhXaWR0aCA9IDAsIH0gPSB7fSkge1xuICAgICAgICAvKlxuICAgICAgICAgKiB1c2luZyB0aGUgc3BlY2lmaWNhdGlvbiBmcm9tIGh0dHA6Ly93d3cuY2hlc3NjbHViLmNvbS9oZWxwL1BHTi1zcGVjXG4gICAgICAgICAqIGV4YW1wbGUgZm9yIGh0bWwgdXNhZ2U6IC5wZ24oeyBtYXhfd2lkdGg6IDcyLCBuZXdsaW5lX2NoYXI6IFwiPGJyIC8+XCIgfSlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQgaGVhZGVyRXhpc3RzID0gZmFsc2U7XG4gICAgICAgIC8qIGFkZCB0aGUgUEdOIGhlYWRlciBpbmZvcm1hdGlvbiAqL1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gdGhpcy5faGVhZGVyKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVE9ETzogb3JkZXIgb2YgZW51bWVyYXRlZCBwcm9wZXJ0aWVzIGluIGhlYWRlciBvYmplY3QgaXMgbm90XG4gICAgICAgICAgICAgKiBndWFyYW50ZWVkLCBzZWUgRUNNQS0yNjIgc3BlYyAoc2VjdGlvbiAxMi42LjQpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCdbJyArIGkgKyAnIFwiJyArIHRoaXMuX2hlYWRlcltpXSArICdcIl0nICsgbmV3bGluZSk7XG4gICAgICAgICAgICBoZWFkZXJFeGlzdHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoZWFkZXJFeGlzdHMgJiYgdGhpcy5faGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFwcGVuZENvbW1lbnQgPSAobW92ZVN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IHRoaXMuX2NvbW1lbnRzW3RoaXMuZmVuKCldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGltaXRlciA9IG1vdmVTdHJpbmcubGVuZ3RoID4gMCA/ICcgJyA6ICcnO1xuICAgICAgICAgICAgICAgIG1vdmVTdHJpbmcgPSBgJHttb3ZlU3RyaW5nfSR7ZGVsaW1pdGVyfXske2NvbW1lbnR9fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbW92ZVN0cmluZztcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcG9wIGFsbCBvZiBoaXN0b3J5IG9udG8gcmV2ZXJzZWRfaGlzdG9yeVxuICAgICAgICBjb25zdCByZXZlcnNlZEhpc3RvcnkgPSBbXTtcbiAgICAgICAgd2hpbGUgKHRoaXMuX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV2ZXJzZWRIaXN0b3J5LnB1c2godGhpcy5fdW5kb01vdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW92ZXMgPSBbXTtcbiAgICAgICAgbGV0IG1vdmVTdHJpbmcgPSAnJztcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIG9mIGEgY29tbWVudGVkIHN0YXJ0aW5nIHBvc2l0aW9uIHdpdGggbm8gbW92ZXNcbiAgICAgICAgaWYgKHJldmVyc2VkSGlzdG9yeS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goYXBwZW5kQ29tbWVudCgnJykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGJ1aWxkIHRoZSBsaXN0IG9mIG1vdmVzLiAgYSBtb3ZlX3N0cmluZyBsb29rcyBsaWtlOiBcIjMuIGUzIGU2XCJcbiAgICAgICAgd2hpbGUgKHJldmVyc2VkSGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBtb3ZlU3RyaW5nID0gYXBwZW5kQ29tbWVudChtb3ZlU3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IG1vdmUgPSByZXZlcnNlZEhpc3RvcnkucG9wKCk7XG4gICAgICAgICAgICAvLyBtYWtlIFR5cGVTY3JpcHQgc3RvcCBjb21wbGFpbmluZyBhYm91dCBtb3ZlIGJlaW5nIHVuZGVmaW5lZFxuICAgICAgICAgICAgaWYgKCFtb3ZlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGUgcG9zaXRpb24gc3RhcnRlZCB3aXRoIGJsYWNrIHRvIG1vdmUsIHN0YXJ0IFBHTiB3aXRoICMuIC4uLlxuICAgICAgICAgICAgaWYgKCF0aGlzLl9oaXN0b3J5Lmxlbmd0aCAmJiBtb3ZlLmNvbG9yID09PSAnYicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVmaXggPSBgJHt0aGlzLl9tb3ZlTnVtYmVyfS4gLi4uYDtcbiAgICAgICAgICAgICAgICAvLyBpcyB0aGVyZSBhIGNvbW1lbnQgcHJlY2VkaW5nIHRoZSBmaXJzdCBtb3ZlP1xuICAgICAgICAgICAgICAgIG1vdmVTdHJpbmcgPSBtb3ZlU3RyaW5nID8gYCR7bW92ZVN0cmluZ30gJHtwcmVmaXh9YCA6IHByZWZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1vdmUuY29sb3IgPT09ICd3Jykge1xuICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBwcmV2aW91cyBnZW5lcmF0ZWQgbW92ZV9zdHJpbmcgaWYgd2UgaGF2ZSBvbmVcbiAgICAgICAgICAgICAgICBpZiAobW92ZVN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZXMucHVzaChtb3ZlU3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW92ZVN0cmluZyA9IHRoaXMuX21vdmVOdW1iZXIgKyAnLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtb3ZlU3RyaW5nID1cbiAgICAgICAgICAgICAgICBtb3ZlU3RyaW5nICsgJyAnICsgdGhpcy5fbW92ZVRvU2FuKG1vdmUsIHRoaXMuX21vdmVzKHsgbGVnYWw6IHRydWUgfSkpO1xuICAgICAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXJlIHRoZXJlIGFueSBvdGhlciBsZWZ0b3ZlciBtb3Zlcz9cbiAgICAgICAgaWYgKG1vdmVTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKGFwcGVuZENvbW1lbnQobW92ZVN0cmluZykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlzIHRoZXJlIGEgcmVzdWx0P1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2hlYWRlci5SZXN1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKHRoaXMuX2hlYWRlci5SZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIGhpc3Rvcnkgc2hvdWxkIGJlIGJhY2sgdG8gd2hhdCBpdCB3YXMgYmVmb3JlIHdlIHN0YXJ0ZWQgZ2VuZXJhdGluZyBQR04sXG4gICAgICAgICAqIHNvIGpvaW4gdG9nZXRoZXIgbW92ZXNcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtYXhXaWR0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKSArIG1vdmVzLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPIChqYWgpOiBodWg/XG4gICAgICAgIGNvbnN0IHN0cmlwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wb3AoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gTkI6IHRoaXMgZG9lcyBub3QgcHJlc2VydmUgY29tbWVudCB3aGl0ZXNwYWNlLlxuICAgICAgICBjb25zdCB3cmFwQ29tbWVudCA9IGZ1bmN0aW9uICh3aWR0aCwgbW92ZSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiBtb3ZlLnNwbGl0KCcgJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod2lkdGggKyB0b2tlbi5sZW5ndGggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3RyaXAoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGgtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXdsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgd2lkdGggKz0gdG9rZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCcgJyk7XG4gICAgICAgICAgICAgICAgd2lkdGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdHJpcCgpKSB7XG4gICAgICAgICAgICAgICAgd2lkdGgtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3aWR0aDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gd3JhcCB0aGUgUEdOIG91dHB1dCBhdCBtYXhfd2lkdGhcbiAgICAgICAgbGV0IGN1cnJlbnRXaWR0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50V2lkdGggKyBtb3Zlc1tpXS5sZW5ndGggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgIGlmIChtb3Zlc1tpXS5pbmNsdWRlcygneycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRXaWR0aCA9IHdyYXBDb21tZW50KGN1cnJlbnRXaWR0aCwgbW92ZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBtb3ZlIHdpbGwgcHVzaCBwYXN0IG1heF93aWR0aFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRXaWR0aCArIG1vdmVzW2ldLmxlbmd0aCA+IG1heFdpZHRoICYmIGkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBlbmQgdGhlIGxpbmUgd2l0aCB3aGl0ZXNwYWNlXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRXaWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goJyAnKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50V2lkdGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG1vdmVzW2ldKTtcbiAgICAgICAgICAgIGN1cnJlbnRXaWR0aCArPSBtb3Zlc1tpXS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgICB9XG4gICAgaGVhZGVyKC4uLmFyZ3MpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbaV0gPT09ICdzdHJpbmcnICYmIHR5cGVvZiBhcmdzW2kgKyAxXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkZXJbYXJnc1tpXV0gPSBhcmdzW2kgKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5faGVhZGVyO1xuICAgIH1cbiAgICBsb2FkUGduKHBnbiwgeyBzdHJpY3QgPSBmYWxzZSwgbmV3bGluZUNoYXIgPSAnXFxyP1xcbicsIH0gPSB7fSkge1xuICAgICAgICBmdW5jdGlvbiBtYXNrKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcL2csICdcXFxcJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcGFyc2VQZ25IZWFkZXIoaGVhZGVyKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJPYmogPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSBoZWFkZXIuc3BsaXQobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVDaGFyKSkpO1xuICAgICAgICAgICAgbGV0IGtleSA9ICcnO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlYWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IC9eXFxzKlxcW1xccyooW0EtWmEtel0rKVxccypcIiguKilcIlxccypcXF1cXHMqJC87XG4gICAgICAgICAgICAgICAga2V5ID0gaGVhZGVyc1tpXS5yZXBsYWNlKHJlZ2V4LCAnJDEnKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGhlYWRlcnNbaV0ucmVwbGFjZShyZWdleCwgJyQyJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJPYmpba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXJPYmo7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3RyaXAgd2hpdGVzcGFjZSBmcm9tIGhlYWQvdGFpbCBvZiBQR04gYmxvY2tcbiAgICAgICAgcGduID0gcGduLnRyaW0oKTtcbiAgICAgICAgLypcbiAgICAgICAgICogUmVnRXhwIHRvIHNwbGl0IGhlYWRlci4gVGFrZXMgYWR2YW50YWdlIG9mIHRoZSBmYWN0IHRoYXQgaGVhZGVyIGFuZCBtb3ZldGV4dFxuICAgICAgICAgKiB3aWxsIGFsd2F5cyBoYXZlIGEgYmxhbmsgbGluZSBiZXR3ZWVuIHRoZW0gKGllLCB0d28gbmV3bGluZV9jaGFyJ3MpLiBIYW5kbGVzXG4gICAgICAgICAqIGNhc2Ugd2hlcmUgbW92ZXRleHQgaXMgZW1wdHkgYnkgbWF0Y2hpbmcgbmV3bGluZUNoYXIgdW50aWwgZW5kIG9mIHN0cmluZyBpc1xuICAgICAgICAgKiBtYXRjaGVkIC0gZWZmZWN0aXZlbHkgdHJpbW1pbmcgZnJvbSB0aGUgZW5kIGV4dHJhIG5ld2xpbmVDaGFyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBXaXRoIGRlZmF1bHQgbmV3bGluZV9jaGFyLCB3aWxsIGVxdWFsOlxuICAgICAgICAgKiAvXihcXFsoKD86XFxyP1xcbil8LikqXFxdKSgoPzpcXHMqXFxyP1xcbil7Mn18KD86XFxzKlxccj9cXG4pKiQpL1xuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgaGVhZGVyUmVnZXggPSBuZXcgUmVnRXhwKCdeKFxcXFxbKCg/OicgK1xuICAgICAgICAgICAgbWFzayhuZXdsaW5lQ2hhcikgK1xuICAgICAgICAgICAgJyl8LikqXFxcXF0pJyArXG4gICAgICAgICAgICAnKCg/OlxcXFxzKicgK1xuICAgICAgICAgICAgbWFzayhuZXdsaW5lQ2hhcikgK1xuICAgICAgICAgICAgJyl7Mn18KD86XFxcXHMqJyArXG4gICAgICAgICAgICBtYXNrKG5ld2xpbmVDaGFyKSArXG4gICAgICAgICAgICAnKSokKScpO1xuICAgICAgICAvLyBJZiBubyBoZWFkZXIgZ2l2ZW4sIGJlZ2luIHdpdGggbW92ZXMuXG4gICAgICAgIGNvbnN0IGhlYWRlclJlZ2V4UmVzdWx0cyA9IGhlYWRlclJlZ2V4LmV4ZWMocGduKTtcbiAgICAgICAgY29uc3QgaGVhZGVyU3RyaW5nID0gaGVhZGVyUmVnZXhSZXN1bHRzXG4gICAgICAgICAgICA/IGhlYWRlclJlZ2V4UmVzdWx0cy5sZW5ndGggPj0gMlxuICAgICAgICAgICAgICAgID8gaGVhZGVyUmVnZXhSZXN1bHRzWzFdXG4gICAgICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgICAgOiAnJztcbiAgICAgICAgLy8gUHV0IHRoZSBib2FyZCBpbiB0aGUgc3RhcnRpbmcgcG9zaXRpb25cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAvLyBwYXJzZSBQR04gaGVhZGVyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBwYXJzZVBnbkhlYWRlcihoZWFkZXJTdHJpbmcpO1xuICAgICAgICBsZXQgZmVuID0gJyc7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIHRvIHNlZSB1c2VyIGlzIGluY2x1ZGluZyBmZW4gKHBvc3NpYmx5IHdpdGggd3JvbmcgdGFnIGNhc2UpXG4gICAgICAgICAgICBpZiAoa2V5LnRvTG93ZXJDYXNlKCkgPT09ICdmZW4nKSB7XG4gICAgICAgICAgICAgICAgZmVuID0gaGVhZGVyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5oZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIHRoZSBwZXJtaXNzaXZlIHBhcnNlciBzaG91bGQgYXR0ZW1wdCB0byBsb2FkIGEgZmVuIHRhZywgZXZlbiBpZiBpdCdzIHRoZVxuICAgICAgICAgKiB3cm9uZyBjYXNlIGFuZCBkb2Vzbid0IGluY2x1ZGUgYSBjb3JyZXNwb25kaW5nIFtTZXRVcCBcIjFcIl0gdGFnXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIXN0cmljdCkge1xuICAgICAgICAgICAgaWYgKGZlbikge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZChmZW4sIHsgcHJlc2VydmVIZWFkZXJzOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIHN0cmljdCBwYXJzZXIgLSBsb2FkIHRoZSBzdGFydGluZyBwb3NpdGlvbiBpbmRpY2F0ZWQgYnkgW1NldHVwICcxJ11cbiAgICAgICAgICAgICAqIGFuZCBbRkVOIHBvc2l0aW9uXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoaGVhZGVyc1snU2V0VXAnXSA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoJ0ZFTicgaW4gaGVhZGVycykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFBHTjogRkVOIHRhZyBtdXN0IGJlIHN1cHBsaWVkIHdpdGggU2V0VXAgdGFnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGNsZWFyIHRoZSBoZWFkZXJzIHdoZW4gbG9hZGluZ1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZChoZWFkZXJzWydGRU4nXSwgeyBwcmVzZXJ2ZUhlYWRlcnM6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogTkI6IHRoZSByZWdleGVzIGJlbG93IHRoYXQgZGVsZXRlIG1vdmUgbnVtYmVycywgcmVjdXJzaXZlIGFubm90YXRpb25zLFxuICAgICAgICAgKiBhbmQgbnVtZXJpYyBhbm5vdGF0aW9uIGdseXBocyBtYXkgYWxzbyBtYXRjaCB0ZXh0IGluIGNvbW1lbnRzLiBUb1xuICAgICAgICAgKiBwcmV2ZW50IHRoaXMsIHdlIHRyYW5zZm9ybSBjb21tZW50cyBieSBoZXgtZW5jb2RpbmcgdGhlbSBpbiBwbGFjZSBhbmRcbiAgICAgICAgICogZGVjb2RpbmcgdGhlbSBhZ2FpbiBhZnRlciB0aGUgb3RoZXIgdG9rZW5zIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBXaGlsZSB0aGUgc3BlYyBzdGF0ZXMgdGhhdCBQR04gZmlsZXMgc2hvdWxkIGJlIEFTQ0lJIGVuY29kZWQsIHdlIHVzZVxuICAgICAgICAgKiB7ZW4sZGV9Y29kZVVSSUNvbXBvbmVudCBoZXJlIHRvIHN1cHBvcnQgYXJiaXRyYXJ5IFVURjggYXMgYSBjb252ZW5pZW5jZVxuICAgICAgICAgKiBmb3IgbW9kZXJuIHVzZXJzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0b0hleChzKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShzKVxuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIGVuY29kZVVSSSBkb2Vzbid0IHRyYW5zZm9ybSBtb3N0IEFTQ0lJIGNoYXJhY3RlcnMsIHNvIHdlIGhhbmRsZVxuICAgICAgICAgICAgICAgICAqIHRoZXNlIG91cnNlbHZlc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgPCAxMjhcbiAgICAgICAgICAgICAgICAgICAgPyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgICAgICAgIDogZW5jb2RlVVJJQ29tcG9uZW50KGMpLnJlcGxhY2UoLyUvZywgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5qb2luKCcnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmcm9tSGV4KHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgICAgIDogZGVjb2RlVVJJQ29tcG9uZW50KCclJyArIChzLm1hdGNoKC8uezEsMn0vZykgfHwgW10pLmpvaW4oJyUnKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW5jb2RlQ29tbWVudCA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICBzID0gcy5yZXBsYWNlKG5ldyBSZWdFeHAobWFzayhuZXdsaW5lQ2hhciksICdnJyksICcgJyk7XG4gICAgICAgICAgICByZXR1cm4gYHske3RvSGV4KHMuc2xpY2UoMSwgcy5sZW5ndGggLSAxKSl9fWA7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGRlY29kZUNvbW1lbnQgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgaWYgKHMuc3RhcnRzV2l0aCgneycpICYmIHMuZW5kc1dpdGgoJ30nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tSGV4KHMuc2xpY2UoMSwgcy5sZW5ndGggLSAxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIGRlbGV0ZSBoZWFkZXIgdG8gZ2V0IHRoZSBtb3Zlc1xuICAgICAgICBsZXQgbXMgPSBwZ25cbiAgICAgICAgICAgIC5yZXBsYWNlKGhlYWRlclN0cmluZywgJycpXG4gICAgICAgICAgICAucmVwbGFjZShcbiAgICAgICAgLy8gZW5jb2RlIGNvbW1lbnRzIHNvIHRoZXkgZG9uJ3QgZ2V0IGRlbGV0ZWQgYmVsb3dcbiAgICAgICAgbmV3IFJlZ0V4cChgKHtbXn1dKn0pKz98OyhbXiR7bWFzayhuZXdsaW5lQ2hhcil9XSopYCwgJ2cnKSwgZnVuY3Rpb24gKF9tYXRjaCwgYnJhY2tldCwgc2VtaWNvbG9uKSB7XG4gICAgICAgICAgICByZXR1cm4gYnJhY2tldCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgPyBlbmNvZGVDb21tZW50KGJyYWNrZXQpXG4gICAgICAgICAgICAgICAgOiAnICcgKyBlbmNvZGVDb21tZW50KGB7JHtzZW1pY29sb24uc2xpY2UoMSl9fWApO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVDaGFyKSwgJ2cnKSwgJyAnKTtcbiAgICAgICAgLy8gZGVsZXRlIHJlY3Vyc2l2ZSBhbm5vdGF0aW9uIHZhcmlhdGlvbnNcbiAgICAgICAgY29uc3QgcmF2UmVnZXggPSAvKFxcKFteKCldK1xcKSkrPy9nO1xuICAgICAgICB3aGlsZSAocmF2UmVnZXgudGVzdChtcykpIHtcbiAgICAgICAgICAgIG1zID0gbXMucmVwbGFjZShyYXZSZWdleCwgJycpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlbGV0ZSBtb3ZlIG51bWJlcnNcbiAgICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXGQrXFwuKFxcLlxcLik/L2csICcnKTtcbiAgICAgICAgLy8gZGVsZXRlIC4uLiBpbmRpY2F0aW5nIGJsYWNrIHRvIG1vdmVcbiAgICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXC5cXC5cXC4vZywgJycpO1xuICAgICAgICAvKiBkZWxldGUgbnVtZXJpYyBhbm5vdGF0aW9uIGdseXBocyAqL1xuICAgICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcJFxcZCsvZywgJycpO1xuICAgICAgICAvLyB0cmltIGFuZCBnZXQgYXJyYXkgb2YgbW92ZXNcbiAgICAgICAgbGV0IG1vdmVzID0gbXMudHJpbSgpLnNwbGl0KG5ldyBSZWdFeHAoL1xccysvKSk7XG4gICAgICAgIC8vIGRlbGV0ZSBlbXB0eSBlbnRyaWVzXG4gICAgICAgIG1vdmVzID0gbW92ZXMuZmlsdGVyKChtb3ZlKSA9PiBtb3ZlICE9PSAnJyk7XG4gICAgICAgIGxldCByZXN1bHQgPSAnJztcbiAgICAgICAgZm9yIChsZXQgaGFsZk1vdmUgPSAwOyBoYWxmTW92ZSA8IG1vdmVzLmxlbmd0aDsgaGFsZk1vdmUrKykge1xuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IGRlY29kZUNvbW1lbnQobW92ZXNbaGFsZk1vdmVdKTtcbiAgICAgICAgICAgIGlmIChjb21tZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21tZW50c1t0aGlzLmZlbigpXSA9IGNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gdGhpcy5fbW92ZUZyb21TYW4obW92ZXNbaGFsZk1vdmVdLCBzdHJpY3QpO1xuICAgICAgICAgICAgLy8gaW52YWxpZCBtb3ZlXG4gICAgICAgICAgICBpZiAobW92ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gd2FzIHRoZSBtb3ZlIGFuIGVuZCBvZiBnYW1lIG1hcmtlclxuICAgICAgICAgICAgICAgIGlmIChURVJNSU5BVElPTl9NQVJLRVJTLmluZGV4T2YobW92ZXNbaGFsZk1vdmVdKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG1vdmVzW2hhbGZNb3ZlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtb3ZlIGluIFBHTjogJHttb3Zlc1toYWxmTW92ZV19YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhlIGVuZCBvZiBnYW1lIG1hcmtlciBpZiBtYWtpbmcgYSB2YWxpZCBtb3ZlXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25Db3VudHNbdGhpcy5mZW4oKV0rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBQZXIgc2VjdGlvbiA4LjIuNiBvZiB0aGUgUEdOIHNwZWMsIHRoZSBSZXN1bHQgdGFnIHBhaXIgbXVzdCBtYXRjaCBtYXRjaFxuICAgICAgICAgKiB0aGUgdGVybWluYXRpb24gbWFya2VyLiBPbmx5IGRvIHRoaXMgd2hlbiBoZWFkZXJzIGFyZSBwcmVzZW50LCBidXQgdGhlXG4gICAgICAgICAqIHJlc3VsdCB0YWcgaXMgbWlzc2luZ1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHJlc3VsdCAmJiBPYmplY3Qua2V5cyh0aGlzLl9oZWFkZXIpLmxlbmd0aCAmJiAhdGhpcy5faGVhZGVyWydSZXN1bHQnXSkge1xuICAgICAgICAgICAgdGhpcy5oZWFkZXIoJ1Jlc3VsdCcsIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLypcbiAgICAgKiBDb252ZXJ0IGEgbW92ZSBmcm9tIDB4ODggY29vcmRpbmF0ZXMgdG8gU3RhbmRhcmQgQWxnZWJyYWljIE5vdGF0aW9uXG4gICAgICogKFNBTilcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RyaWN0IFVzZSB0aGUgc3RyaWN0IFNBTiBwYXJzZXIuIEl0IHdpbGwgdGhyb3cgZXJyb3JzXG4gICAgICogb24gb3Zlcmx5IGRpc2FtYmlndWF0ZWQgbW92ZXMgKHNlZSBiZWxvdyk6XG4gICAgICpcbiAgICAgKiByMWJxa2Juci9wcHAycHBwLzJuNS8xQjFwUDMvNFAzLzgvUFBQUDJQUC9STkJRSzFOUiBiIEtRa3EgLSAyIDRcbiAgICAgKiA0LiAuLi4gTmdlNyBpcyBvdmVybHkgZGlzYW1iaWd1YXRlZCBiZWNhdXNlIHRoZSBrbmlnaHQgb24gYzYgaXMgcGlubmVkXG4gICAgICogNC4gLi4uIE5lNyBpcyB0ZWNobmljYWxseSB0aGUgdmFsaWQgU0FOXG4gICAgICovXG4gICAgX21vdmVUb1Nhbihtb3ZlLCBtb3Zlcykge1xuICAgICAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgICAgIG91dHB1dCA9ICdPLU8nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICAgICAgb3V0cHV0ID0gJ08tTy1PJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtb3ZlLnBpZWNlICE9PSBQQVdOKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzYW1iaWd1YXRvciA9IGdldERpc2FtYmlndWF0b3IobW92ZSwgbW92ZXMpO1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBtb3ZlLnBpZWNlLnRvVXBwZXJDYXNlKCkgKyBkaXNhbWJpZ3VhdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5DQVBUVVJFIHwgQklUUy5FUF9DQVBUVVJFKSkge1xuICAgICAgICAgICAgICAgIGlmIChtb3ZlLnBpZWNlID09PSBQQVdOKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBhbGdlYnJhaWMobW92ZS5mcm9tKVswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICd4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dHB1dCArPSBhbGdlYnJhaWMobW92ZS50byk7XG4gICAgICAgICAgICBpZiAobW92ZS5wcm9tb3Rpb24pIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJz0nICsgbW92ZS5wcm9tb3Rpb24udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYWtlTW92ZShtb3ZlKTtcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVjaygpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0NoZWNrbWF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICcjJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnKyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdW5kb01vdmUoKTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gICAgLy8gY29udmVydCBhIG1vdmUgZnJvbSBTdGFuZGFyZCBBbGdlYnJhaWMgTm90YXRpb24gKFNBTikgdG8gMHg4OCBjb29yZGluYXRlc1xuICAgIF9tb3ZlRnJvbVNhbihtb3ZlLCBzdHJpY3QgPSBmYWxzZSkge1xuICAgICAgICAvLyBzdHJpcCBvZmYgYW55IG1vdmUgZGVjb3JhdGlvbnM6IGUuZyBOZjMrPyEgYmVjb21lcyBOZjNcbiAgICAgICAgY29uc3QgY2xlYW5Nb3ZlID0gc3RyaXBwZWRTYW4obW92ZSk7XG4gICAgICAgIGxldCBwaWVjZVR5cGUgPSBpbmZlclBpZWNlVHlwZShjbGVhbk1vdmUpO1xuICAgICAgICBsZXQgbW92ZXMgPSB0aGlzLl9tb3Zlcyh7IGxlZ2FsOiB0cnVlLCBwaWVjZTogcGllY2VUeXBlIH0pO1xuICAgICAgICAvLyBzdHJpY3QgcGFyc2VyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGNsZWFuTW92ZSA9PT0gc3RyaXBwZWRTYW4odGhpcy5fbW92ZVRvU2FuKG1vdmVzW2ldLCBtb3ZlcykpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoZSBzdHJpY3QgcGFyc2VyIGZhaWxlZFxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGllY2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBtYXRjaGVzID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgZnJvbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHRvID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgcHJvbW90aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAvKlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBwZXJtaXNzaXZlIChub24tc3RyaWN0KSBwYXJzZXIgYWxsb3dzIHRoZSB1c2VyIHRvIHBhcnNlXG4gICAgICAgICAqIG5vbi1zdGFuZGFyZCBjaGVzcyBub3RhdGlvbnMuIFRoaXMgcGFyc2VyIGlzIG9ubHkgcnVuIGFmdGVyIHRoZSBzdHJpY3RcbiAgICAgICAgICogU3RhbmRhcmQgQWxnZWJyYWljIE5vdGF0aW9uIChTQU4pIHBhcnNlciBoYXMgZmFpbGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBXaGVuIHJ1bm5pbmcgdGhlIHBlcm1pc3NpdmUgcGFyc2VyLCB3ZSdsbCBydW4gYSByZWdleCB0byBncmFiIHRoZSBwaWVjZSwgdGhlXG4gICAgICAgICAqIHRvL2Zyb20gc3F1YXJlLCBhbmQgYW4gb3B0aW9uYWwgcHJvbW90aW9uIHBpZWNlLiBUaGlzIHJlZ2V4IHdpbGxcbiAgICAgICAgICogcGFyc2UgY29tbW9uIG5vbi1zdGFuZGFyZCBub3RhdGlvbiBsaWtlOiBQZTItZTQsIFJjMWM0LCBRZjN4ZjcsXG4gICAgICAgICAqIGY3ZjhxLCBiMWMzXG4gICAgICAgICAqXG4gICAgICAgICAqIE5PVEU6IFNvbWUgcG9zaXRpb25zIGFuZCBtb3ZlcyBtYXkgYmUgYW1iaWd1b3VzIHdoZW4gdXNpbmcgdGhlIHBlcm1pc3NpdmVcbiAgICAgICAgICogcGFyc2VyLiBGb3IgZXhhbXBsZSwgaW4gdGhpcyBwb3NpdGlvbjogNmsxLzgvOC9CNy84LzgvOC9CTjRLMSB3IC0gLSAwIDEsXG4gICAgICAgICAqIHRoZSBtb3ZlIGIxYzMgbWF5IGJlIGludGVycHJldGVkIGFzIE5jMyBvciBCMWMzIChhIGRpc2FtYmlndWF0ZWQgYmlzaG9wXG4gICAgICAgICAqIG1vdmUpLiBJbiB0aGVzZSBjYXNlcywgdGhlIHBlcm1pc3NpdmUgcGFyc2VyIHdpbGwgZGVmYXVsdCB0byB0aGUgbW9zdFxuICAgICAgICAgKiBiYXNpYyBpbnRlcnByZXRhdGlvbiAod2hpY2ggaXMgYjFjMyBwYXJzaW5nIHRvIE5jMykuXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgb3Zlcmx5RGlzYW1iaWd1YXRlZCA9IGZhbHNlO1xuICAgICAgICBtYXRjaGVzID0gY2xlYW5Nb3ZlLm1hdGNoKC8oW3BuYnJxa1BOQlJRS10pPyhbYS1oXVsxLThdKXg/LT8oW2EtaF1bMS04XSkoW3FyYm5RUkJOXSk/Lyk7XG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICBwaWVjZSA9IG1hdGNoZXNbMV07XG4gICAgICAgICAgICBmcm9tID0gbWF0Y2hlc1syXTtcbiAgICAgICAgICAgIHRvID0gbWF0Y2hlc1szXTtcbiAgICAgICAgICAgIHByb21vdGlvbiA9IG1hdGNoZXNbNF07XG4gICAgICAgICAgICBpZiAoZnJvbS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIG92ZXJseURpc2FtYmlndWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRoZSBbYS1oXT9bMS04XT8gcG9ydGlvbiBvZiB0aGUgcmVnZXggYmVsb3cgaGFuZGxlcyBtb3ZlcyB0aGF0IG1heSBiZVxuICAgICAgICAgICAgICogb3Zlcmx5IGRpc2FtYmlndWF0ZWQgKGUuZy4gTmdlNyBpcyB1bm5lY2Vzc2FyeSBhbmQgbm9uLXN0YW5kYXJkIHdoZW5cbiAgICAgICAgICAgICAqIHRoZXJlIGlzIG9uZSBsZWdhbCBrbmlnaHQgbW92ZSB0byBlNykuIEluIHRoaXMgY2FzZSwgdGhlIHZhbHVlIG9mXG4gICAgICAgICAgICAgKiAnZnJvbScgdmFyaWFibGUgd2lsbCBiZSBhIHJhbmsgb3IgZmlsZSwgbm90IGEgc3F1YXJlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtYXRjaGVzID0gY2xlYW5Nb3ZlLm1hdGNoKC8oW3BuYnJxa1BOQlJRS10pPyhbYS1oXT9bMS04XT8peD8tPyhbYS1oXVsxLThdKShbcXJiblFSQk5dKT8vKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgcGllY2UgPSBtYXRjaGVzWzFdO1xuICAgICAgICAgICAgICAgIGZyb20gPSBtYXRjaGVzWzJdO1xuICAgICAgICAgICAgICAgIHRvID0gbWF0Y2hlc1szXTtcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb24gPSBtYXRjaGVzWzRdO1xuICAgICAgICAgICAgICAgIGlmIChmcm9tLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJseURpc2FtYmlndWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwaWVjZVR5cGUgPSBpbmZlclBpZWNlVHlwZShjbGVhbk1vdmUpO1xuICAgICAgICBtb3ZlcyA9IHRoaXMuX21vdmVzKHtcbiAgICAgICAgICAgIGxlZ2FsOiB0cnVlLFxuICAgICAgICAgICAgcGllY2U6IHBpZWNlID8gcGllY2UgOiBwaWVjZVR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXRvKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghZnJvbSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGZyb20gc3F1YXJlLCBpdCBjb3VsZCBiZSBqdXN0ICd4JyBtaXNzaW5nIGZyb20gYSBjYXB0dXJlXG4gICAgICAgICAgICAgICAgaWYgKGNsZWFuTW92ZSA9PT1cbiAgICAgICAgICAgICAgICAgICAgc3RyaXBwZWRTYW4odGhpcy5fbW92ZVRvU2FuKG1vdmVzW2ldLCBtb3ZlcykpLnJlcGxhY2UoJ3gnLCAnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBoYW5kLWNvbXBhcmUgbW92ZSBwcm9wZXJ0aWVzIHdpdGggdGhlIHJlc3VsdHMgZnJvbSBvdXIgcGVybWlzc2l2ZSByZWdleFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKCFwaWVjZSB8fCBwaWVjZS50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnBpZWNlKSAmJlxuICAgICAgICAgICAgICAgIE94ODhbZnJvbV0gPT0gbW92ZXNbaV0uZnJvbSAmJlxuICAgICAgICAgICAgICAgIE94ODhbdG9dID09IG1vdmVzW2ldLnRvICYmXG4gICAgICAgICAgICAgICAgKCFwcm9tb3Rpb24gfHwgcHJvbW90aW9uLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucHJvbW90aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb3Zlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG92ZXJseURpc2FtYmlndWF0ZWQpIHtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFNQRUNJQUwgQ0FTRTogd2UgcGFyc2VkIGEgbW92ZSBzdHJpbmcgdGhhdCBtYXkgaGF2ZSBhbiB1bm5lZWRlZFxuICAgICAgICAgICAgICAgICAqIHJhbmsvZmlsZSBkaXNhbWJpZ3VhdG9yIChlLmcuIE5nZTcpLiAgVGhlICdmcm9tJyB2YXJpYWJsZSB3aWxsXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gYWxnZWJyYWljKG1vdmVzW2ldLmZyb20pO1xuICAgICAgICAgICAgICAgIGlmICgoIXBpZWNlIHx8IHBpZWNlLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucGllY2UpICYmXG4gICAgICAgICAgICAgICAgICAgIE94ODhbdG9dID09IG1vdmVzW2ldLnRvICYmXG4gICAgICAgICAgICAgICAgICAgIChmcm9tID09IHNxdWFyZVswXSB8fCBmcm9tID09IHNxdWFyZVsxXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFwcm9tb3Rpb24gfHwgcHJvbW90aW9uLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucHJvbW90aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW92ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBhc2NpaSgpIHtcbiAgICAgICAgbGV0IHMgPSAnICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcXG4nO1xuICAgICAgICBmb3IgKGxldCBpID0gT3g4OC5hODsgaSA8PSBPeDg4LmgxOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGRpc3BsYXkgdGhlIHJhbmtcbiAgICAgICAgICAgIGlmIChmaWxlKGkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcyArPSAnICcgKyAnODc2NTQzMjEnW3JhbmsoaSldICsgJyB8JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9ib2FyZFtpXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBpZWNlID0gdGhpcy5fYm9hcmRbaV0udHlwZTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IHRoaXMuX2JvYXJkW2ldLmNvbG9yO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IGNvbG9yID09PSBXSElURSA/IHBpZWNlLnRvVXBwZXJDYXNlKCkgOiBwaWVjZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHMgKz0gJyAnICsgc3ltYm9sICsgJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcyArPSAnIC4gJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoaSArIDEpICYgMHg4OCkge1xuICAgICAgICAgICAgICAgIHMgKz0gJ3xcXG4nO1xuICAgICAgICAgICAgICAgIGkgKz0gODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzICs9ICcgICArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xcbic7XG4gICAgICAgIHMgKz0gJyAgICAgYSAgYiAgYyAgZCAgZSAgZiAgZyAgaCc7XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBwZXJmdChkZXB0aCkge1xuICAgICAgICBjb25zdCBtb3ZlcyA9IHRoaXMuX21vdmVzKHsgbGVnYWw6IGZhbHNlIH0pO1xuICAgICAgICBsZXQgbm9kZXMgPSAwO1xuICAgICAgICBjb25zdCBjb2xvciA9IHRoaXMuX3R1cm47XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZXNbaV0pO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0tpbmdBdHRhY2tlZChjb2xvcikpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVwdGggLSAxID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlcyArPSB0aGlzLnBlcmZ0KGRlcHRoIC0gMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBub2RlcysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VuZG9Nb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cbiAgICAvLyBwcmV0dHkgPSBleHRlcm5hbCBtb3ZlIG9iamVjdFxuICAgIF9tYWtlUHJldHR5KHVnbHlNb3ZlKSB7XG4gICAgICAgIGNvbnN0IHsgY29sb3IsIHBpZWNlLCBmcm9tLCB0bywgZmxhZ3MsIGNhcHR1cmVkLCBwcm9tb3Rpb24gfSA9IHVnbHlNb3ZlO1xuICAgICAgICBsZXQgcHJldHR5RmxhZ3MgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBmbGFnIGluIEJJVFMpIHtcbiAgICAgICAgICAgIGlmIChCSVRTW2ZsYWddICYgZmxhZ3MpIHtcbiAgICAgICAgICAgICAgICBwcmV0dHlGbGFncyArPSBGTEFHU1tmbGFnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmcm9tQWxnZWJyYWljID0gYWxnZWJyYWljKGZyb20pO1xuICAgICAgICBjb25zdCB0b0FsZ2VicmFpYyA9IGFsZ2VicmFpYyh0byk7XG4gICAgICAgIGNvbnN0IG1vdmUgPSB7XG4gICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgIHBpZWNlLFxuICAgICAgICAgICAgZnJvbTogZnJvbUFsZ2VicmFpYyxcbiAgICAgICAgICAgIHRvOiB0b0FsZ2VicmFpYyxcbiAgICAgICAgICAgIHNhbjogdGhpcy5fbW92ZVRvU2FuKHVnbHlNb3ZlLCB0aGlzLl9tb3Zlcyh7IGxlZ2FsOiB0cnVlIH0pKSxcbiAgICAgICAgICAgIGZsYWdzOiBwcmV0dHlGbGFncyxcbiAgICAgICAgICAgIGxhbjogZnJvbUFsZ2VicmFpYyArIHRvQWxnZWJyYWljLFxuICAgICAgICAgICAgYmVmb3JlOiB0aGlzLmZlbigpLFxuICAgICAgICAgICAgYWZ0ZXI6ICcnLFxuICAgICAgICB9O1xuICAgICAgICAvLyBnZW5lcmF0ZSB0aGUgRkVOIGZvciB0aGUgJ2FmdGVyJyBrZXlcbiAgICAgICAgdGhpcy5fbWFrZU1vdmUodWdseU1vdmUpO1xuICAgICAgICBtb3ZlLmFmdGVyID0gdGhpcy5mZW4oKTtcbiAgICAgICAgdGhpcy5fdW5kb01vdmUoKTtcbiAgICAgICAgaWYgKGNhcHR1cmVkKSB7XG4gICAgICAgICAgICBtb3ZlLmNhcHR1cmVkID0gY2FwdHVyZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb21vdGlvbikge1xuICAgICAgICAgICAgbW92ZS5wcm9tb3Rpb24gPSBwcm9tb3Rpb247XG4gICAgICAgICAgICBtb3ZlLmxhbiArPSBwcm9tb3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vdmU7XG4gICAgfVxuICAgIHR1cm4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90dXJuO1xuICAgIH1cbiAgICBib2FyZCgpIHtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XG4gICAgICAgIGxldCByb3cgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IE94ODguYTg7IGkgPD0gT3g4OC5oMTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYm9hcmRbaV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJvdy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzcXVhcmU6IGFsZ2VicmFpYyhpKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5fYm9hcmRbaV0udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuX2JvYXJkW2ldLmNvbG9yLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICByb3cgPSBbXTtcbiAgICAgICAgICAgICAgICBpICs9IDg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gICAgc3F1YXJlQ29sb3Ioc3F1YXJlKSB7XG4gICAgICAgIGlmIChzcXVhcmUgaW4gT3g4OCkge1xuICAgICAgICAgICAgY29uc3Qgc3EgPSBPeDg4W3NxdWFyZV07XG4gICAgICAgICAgICByZXR1cm4gKHJhbmsoc3EpICsgZmlsZShzcSkpICUgMiA9PT0gMCA/ICdsaWdodCcgOiAnZGFyayc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGhpc3RvcnkoeyB2ZXJib3NlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHJldmVyc2VkSGlzdG9yeSA9IFtdO1xuICAgICAgICBjb25zdCBtb3ZlSGlzdG9yeSA9IFtdO1xuICAgICAgICB3aGlsZSAodGhpcy5faGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXZlcnNlZEhpc3RvcnkucHVzaCh0aGlzLl91bmRvTW92ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgbW92ZSA9IHJldmVyc2VkSGlzdG9yeS5wb3AoKTtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZlcmJvc2UpIHtcbiAgICAgICAgICAgICAgICBtb3ZlSGlzdG9yeS5wdXNoKHRoaXMuX21ha2VQcmV0dHkobW92ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbW92ZUhpc3RvcnkucHVzaCh0aGlzLl9tb3ZlVG9TYW4obW92ZSwgdGhpcy5fbW92ZXMoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vdmVIaXN0b3J5O1xuICAgIH1cbiAgICBfcHJ1bmVDb21tZW50cygpIHtcbiAgICAgICAgY29uc3QgcmV2ZXJzZWRIaXN0b3J5ID0gW107XG4gICAgICAgIGNvbnN0IGN1cnJlbnRDb21tZW50cyA9IHt9O1xuICAgICAgICBjb25zdCBjb3B5Q29tbWVudCA9IChmZW4pID0+IHtcbiAgICAgICAgICAgIGlmIChmZW4gaW4gdGhpcy5fY29tbWVudHMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29tbWVudHNbZmVuXSA9IHRoaXMuX2NvbW1lbnRzW2Zlbl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHdoaWxlICh0aGlzLl9oaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldmVyc2VkSGlzdG9yeS5wdXNoKHRoaXMuX3VuZG9Nb3ZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvcHlDb21tZW50KHRoaXMuZmVuKCkpO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgbW92ZSA9IHJldmVyc2VkSGlzdG9yeS5wb3AoKTtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fbWFrZU1vdmUobW92ZSk7XG4gICAgICAgICAgICBjb3B5Q29tbWVudCh0aGlzLmZlbigpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb21tZW50cyA9IGN1cnJlbnRDb21tZW50cztcbiAgICB9XG4gICAgZ2V0Q29tbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1lbnRzW3RoaXMuZmVuKCldO1xuICAgIH1cbiAgICBzZXRDb21tZW50KGNvbW1lbnQpIHtcbiAgICAgICAgdGhpcy5fY29tbWVudHNbdGhpcy5mZW4oKV0gPSBjb21tZW50LnJlcGxhY2UoJ3snLCAnWycpLnJlcGxhY2UoJ30nLCAnXScpO1xuICAgIH1cbiAgICBkZWxldGVDb21tZW50KCkge1xuICAgICAgICBjb25zdCBjb21tZW50ID0gdGhpcy5fY29tbWVudHNbdGhpcy5mZW4oKV07XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb21tZW50c1t0aGlzLmZlbigpXTtcbiAgICAgICAgcmV0dXJuIGNvbW1lbnQ7XG4gICAgfVxuICAgIGdldENvbW1lbnRzKCkge1xuICAgICAgICB0aGlzLl9wcnVuZUNvbW1lbnRzKCk7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9jb21tZW50cykubWFwKChmZW4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IGZlbjogZmVuLCBjb21tZW50OiB0aGlzLl9jb21tZW50c1tmZW5dIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkZWxldGVDb21tZW50cygpIHtcbiAgICAgICAgdGhpcy5fcHJ1bmVDb21tZW50cygpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fY29tbWVudHMpLm1hcCgoZmVuKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gdGhpcy5fY29tbWVudHNbZmVuXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jb21tZW50c1tmZW5dO1xuICAgICAgICAgICAgcmV0dXJuIHsgZmVuOiBmZW4sIGNvbW1lbnQ6IGNvbW1lbnQgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldENhc3RsaW5nUmlnaHRzKGNvbG9yLCByaWdodHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBzaWRlIG9mIFtLSU5HLCBRVUVFTl0pIHtcbiAgICAgICAgICAgIGlmIChyaWdodHNbc2lkZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChyaWdodHNbc2lkZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmdbY29sb3JdIHw9IFNJREVTW3NpZGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzdGxpbmdbY29sb3JdICY9IH5TSURFU1tzaWRlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlQ2FzdGxpbmdSaWdodHMoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXRDYXN0bGluZ1JpZ2h0cyhjb2xvcik7XG4gICAgICAgIHJldHVybiAoKHJpZ2h0c1tLSU5HXSA9PT0gdW5kZWZpbmVkIHx8IHJpZ2h0c1tLSU5HXSA9PT0gcmVzdWx0W0tJTkddKSAmJlxuICAgICAgICAgICAgKHJpZ2h0c1tRVUVFTl0gPT09IHVuZGVmaW5lZCB8fCByaWdodHNbUVVFRU5dID09PSByZXN1bHRbUVVFRU5dKSk7XG4gICAgfVxuICAgIGdldENhc3RsaW5nUmlnaHRzKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBbS0lOR106ICh0aGlzLl9jYXN0bGluZ1tjb2xvcl0gJiBTSURFU1tLSU5HXSkgIT09IDAsXG4gICAgICAgICAgICBbUVVFRU5dOiAodGhpcy5fY2FzdGxpbmdbY29sb3JdICYgU0lERVNbUVVFRU5dKSAhPT0gMCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgbW92ZU51bWJlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vdmVOdW1iZXI7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2hlc3MuanMubWFwIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC5wbGF5ZXJ7XHJcbiAgICBjb2x1bW4tY291bnQ6MjtcclxufVxyXG4ucGxheWVyLmFib3Zle1xyXG4gICAgcGFkZGluZy10b3A6NHB4O1xyXG59XHJcbi5wbGF5ZXIuYmVsb3d7XHJcbiAgICBtYXJnaW4tdG9wOi0xcHg7XHJcbn1cclxuLnBsYXllci5iZWxvdyAuY2FwdHVyZXN7XHJcbiAgICBtYXJnaW4tdG9wOi02cHg7XHJcbn1cclxuLnBsYXllciAubmFtZXtcclxuICAgIGNsZWFyOmJvdGg7XHJcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcclxuICAgIHBhZGRpbmctcmlnaHQ6NHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6M3ZoO1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVze1xyXG4gICAgZmxvYXQ6bGVmdDtcclxuICAgIG1hcmdpbi10b3A6LTVweDtcclxufVxyXG4ucGxheWVyIC5zY29yZXtcclxuICAgIGZsb2F0OmxlZnQ7XHJcbiAgICBtYXJnaW4tbGVmdDo1cHg7XHJcbiAgICBtYXJnaW4tdG9wOjZweDtcclxuICAgIGZvbnQtc2l6ZToxMHB0O1xyXG59XHJcbi5wbGF5ZXIgLmNhcHR1cmVzIHN2Z3tcclxuICAgIHBvc2l0aW9uOnN0YXRpYztcclxuICAgIGhlaWdodDo0dmg7XHJcbiAgICB3aWR0aDo0dmg7XHJcbiAgICB0cmFuc2Zvcm06bm9uZTtcclxuICAgIG1hcmdpbi10b3A6MDtcclxuICAgIG1hcmdpbi1ib3R0b206LTExcHg7XHJcbn1cclxuLnBsYXllci53aGl0ZSAuY2FwdHVyZXMgc3BhbntcclxuICAgIHBhZGRpbmctYm90dG9tOiA3cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLnAgc3ZnOmZpcnN0LWNoaWxke1xyXG4gICAgcGFkZGluZy1sZWZ0OjRweDtcclxufVxyXG4ucGxheWVyIC5jYXB0dXJlcyAucCBzdmd7XHJcbiAgICBtYXJnaW4tbGVmdDotOHB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0Oi01cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLm57XHJcbiAgICBtYXJnaW4tbGVmdDogMnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxcHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLm4gc3Zne1xyXG4gICAgbWFyZ2luLWxlZnQ6IC02cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IC0zcHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLmIgc3Zne1xyXG4gICAgbWFyZ2luLWxlZnQ6IC03cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IC00cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLnIgc3Zne1xyXG4gICAgbWFyZ2luLWxlZnQ6IC02cHg7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IC01cHg7XHJcbn1cclxuLnBsYXllciAuY2FwdHVyZXMgLnEgc3Zne1xyXG4gICAgbWFyZ2luLWJvdHRvbTotMTBweDtcclxuICAgIG1hcmdpbi1sZWZ0OiAtMnB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAwcHg7XHJcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jb21wb25lbnRzL3YyL2dhbWVCcm93c2VyL2dhbWVCcm93c2VyLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLGNBQWM7QUFDbEI7QUFDQTtJQUNJLGVBQWU7QUFDbkI7QUFDQTtJQUNJLGVBQWU7QUFDbkI7QUFDQTtJQUNJLGVBQWU7QUFDbkI7QUFDQTtJQUNJLFVBQVU7SUFDVixpQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLGVBQWU7QUFDbkI7QUFDQTtJQUNJLFVBQVU7SUFDVixlQUFlO0FBQ25CO0FBQ0E7SUFDSSxVQUFVO0lBQ1YsZUFBZTtJQUNmLGNBQWM7SUFDZCxjQUFjO0FBQ2xCO0FBQ0E7SUFDSSxlQUFlO0lBQ2YsVUFBVTtJQUNWLFNBQVM7SUFDVCxjQUFjO0lBQ2QsWUFBWTtJQUNaLG1CQUFtQjtBQUN2QjtBQUNBO0lBQ0ksbUJBQW1CO0FBQ3ZCO0FBQ0E7SUFDSSxnQkFBZ0I7QUFDcEI7QUFDQTtJQUNJLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckI7QUFDQTtJQUNJLGdCQUFnQjtJQUNoQixpQkFBaUI7QUFDckI7QUFDQTtJQUNJLGlCQUFpQjtJQUNqQixrQkFBa0I7QUFDdEI7QUFDQTtJQUNJLGlCQUFpQjtJQUNqQixrQkFBa0I7QUFDdEI7QUFDQTtJQUNJLGlCQUFpQjtJQUNqQixrQkFBa0I7QUFDdEI7QUFDQTtJQUNJLG1CQUFtQjtJQUNuQixpQkFBaUI7SUFDakIsaUJBQWlCO0FBQ3JCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5wbGF5ZXJ7XFxyXFxuICAgIGNvbHVtbi1jb3VudDoyO1xcclxcbn1cXHJcXG4ucGxheWVyLmFib3Zle1xcclxcbiAgICBwYWRkaW5nLXRvcDo0cHg7XFxyXFxufVxcclxcbi5wbGF5ZXIuYmVsb3d7XFxyXFxuICAgIG1hcmdpbi10b3A6LTFweDtcXHJcXG59XFxyXFxuLnBsYXllci5iZWxvdyAuY2FwdHVyZXN7XFxyXFxuICAgIG1hcmdpbi10b3A6LTZweDtcXHJcXG59XFxyXFxuLnBsYXllciAubmFtZXtcXHJcXG4gICAgY2xlYXI6Ym90aDtcXHJcXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XFxyXFxuICAgIHBhZGRpbmctcmlnaHQ6NHB4O1xcclxcbiAgICBsaW5lLWhlaWdodDozdmg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVze1xcclxcbiAgICBmbG9hdDpsZWZ0O1xcclxcbiAgICBtYXJnaW4tdG9wOi01cHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLnNjb3Jle1xcclxcbiAgICBmbG9hdDpsZWZ0O1xcclxcbiAgICBtYXJnaW4tbGVmdDo1cHg7XFxyXFxuICAgIG1hcmdpbi10b3A6NnB4O1xcclxcbiAgICBmb250LXNpemU6MTBwdDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgc3Zne1xcclxcbiAgICBwb3NpdGlvbjpzdGF0aWM7XFxyXFxuICAgIGhlaWdodDo0dmg7XFxyXFxuICAgIHdpZHRoOjR2aDtcXHJcXG4gICAgdHJhbnNmb3JtOm5vbmU7XFxyXFxuICAgIG1hcmdpbi10b3A6MDtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTotMTFweDtcXHJcXG59XFxyXFxuLnBsYXllci53aGl0ZSAuY2FwdHVyZXMgc3BhbntcXHJcXG4gICAgcGFkZGluZy1ib3R0b206IDdweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLnAgc3ZnOmZpcnN0LWNoaWxke1xcclxcbiAgICBwYWRkaW5nLWxlZnQ6NHB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlcyAucCBzdmd7XFxyXFxuICAgIG1hcmdpbi1sZWZ0Oi04cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDotNXB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlcyAubntcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDJweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAxcHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIC5uIHN2Z3tcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IC02cHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogLTNweDtcXHJcXG59XFxyXFxuLnBsYXllciAuY2FwdHVyZXMgLmIgc3Zne1xcclxcbiAgICBtYXJnaW4tbGVmdDogLTdweDtcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAtNHB4O1xcclxcbn1cXHJcXG4ucGxheWVyIC5jYXB0dXJlcyAuciBzdmd7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAtNnB4O1xcclxcbiAgICBtYXJnaW4tcmlnaHQ6IC01cHg7XFxyXFxufVxcclxcbi5wbGF5ZXIgLmNhcHR1cmVzIC5xIHN2Z3tcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTotMTBweDtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IC0ycHg7XFxyXFxuICAgIG1hcmdpbi1yaWdodDogMHB4O1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGJvZHl7cGFkZGluZzowO21hcmdpbjowO31gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9wYWdlcy9vcGVuaW5ncy9vcGVuaW5ncy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsS0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImJvZHl7cGFkZGluZzowO21hcmdpbjowO31cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lQnJvd3Nlci5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWVCcm93c2VyLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9vcGVuaW5ncy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL29wZW5pbmdzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiaW1wb3J0IEJvYXJkTGF5ZXIgZnJvbSBcIi4vTGF5ZXJzL0JvYXJkTGF5ZXJcIjtcclxuaW1wb3J0IENvcmRzTGF5ZXIgZnJvbSBcIi4vTGF5ZXJzL0NvcmRzTGF5ZXJcIjtcclxuaW1wb3J0IFBpZWNlTGF5ZXIgZnJvbSBcIi4vTGF5ZXJzL1BpZWNlTGF5ZXJcIjtcclxuaW1wb3J0IEFycm93TGF5ZXIgZnJvbSBcIi4vTGF5ZXJzL0Fycm93TGF5ZXJcIjtcclxuaW1wb3J0IE1vdXNlRXZlbnRzIGZyb20gXCIuL01vdXNlRXZlbnRzXCI7XHJcbmltcG9ydCBTaGFyZWQgZnJvbSBcIi4vU2hhcmVkXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGVzc2JvYXJke1xyXG4gICAgc3ZnUm9vdDpTVkdTVkdFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBib2FyZExheWVyOkJvYXJkTGF5ZXI7XHJcbiAgICBwcml2YXRlIGNvcmRzTGF5ZXI6Q29yZHNMYXllcjtcclxuICAgIHByaXZhdGUgcGllY2VMYXllcjpQaWVjZUxheWVyO1xyXG4gICAgcHJpdmF0ZSBhcnJvd0xheWVyOkFycm93TGF5ZXI7XHJcbiAgICBwcml2YXRlIG1vdXNlRXZlbnRzOk1vdXNlRXZlbnRzXHJcbiAgICBwcml2YXRlIGlzUm90YXRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJvYXJkQ29udGFpbmVyOkhUTUxFbGVtZW50LCBmZW46c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3Quc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCA4MDAgODAwJyk7XHJcbiAgICAgICAgYm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zdmdSb290KTtcclxuXHJcbiAgICAgICAgdGhpcy5ib2FyZExheWVyID0gbmV3IEJvYXJkTGF5ZXIodGhpcy5zdmdSb290LCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuY29yZHNMYXllciA9IG5ldyBDb3Jkc0xheWVyKHRoaXMuc3ZnUm9vdCwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnBpZWNlTGF5ZXIgPSBuZXcgUGllY2VMYXllcih0aGlzLnN2Z1Jvb3QsIGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5hcnJvd0xheWVyID0gbmV3IEFycm93TGF5ZXIodGhpcy5zdmdSb290LCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMubW91c2VFdmVudHMgPSBuZXcgTW91c2VFdmVudHModGhpcy5zdmdSb290LCB0aGlzLmJvYXJkTGF5ZXIsIHRoaXMuYXJyb3dMYXllciwgdGhpcy5pc1JvdGF0ZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEZlbihmZW4sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHJvdGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gIXRoaXMuaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuY29yZHNMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMucGllY2VMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuYXJyb3dMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMubW91c2VFdmVudHMucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgIH1cclxuICAgIHNldEZlbihmZW46c3RyaW5nLCBjbGVhckZpcnN0OmJvb2xlYW4pe1xyXG4gICAgICAgIGlmIChjbGVhckZpcnN0KXtcclxuICAgICAgICAgICAgdGhpcy5waWVjZUxheWVyLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmZW4gIT09IFwiXCIpe1xyXG4gICAgICAgICAgICBpZiAoZmVuLnRvTG93ZXJDYXNlKCkgPT09IFwic3RhcnRcIilcclxuICAgICAgICAgICAgICAgIGZlbiA9IFNoYXJlZC5zdGFydEZFTjtcclxuICAgICAgICAgICAgZmVuID0gZmVuLnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi9cIikuam9pbihcIlwiKTtcclxuICAgICAgICAgICAgbGV0IHNxdWFyZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZW4ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZlbkNoYXIgPSBmZW5baV07XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVtbWVyaWNWYWx1ZSA9IHBhcnNlSW50KGZlbkNoYXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1tZXJpY1ZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3F1YXJlSW5kZXggKz0gbnVtbWVyaWNWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdGF0ZWRJbmRleCA9IHRoaXMuaXNSb3RhdGVkID8gNjMgLSBzcXVhcmVJbmRleCA6IHNxdWFyZUluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSBTaGFyZWQuZ2V0U3F1YXJlS2V5QnlJbmRleChyb3RhdGVkSW5kZXgsIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBpZWNlTGF5ZXIuYWRkUGllY2UoZmVuQ2hhciwga2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBzcXVhcmVJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0UGllY2Uoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGllY2VMYXllci5nZXRQaWVjZShzcXVhcmVLZXkpO1xyXG4gICAgfVxyXG4gICAgYWRkUGllY2UoZmVuQ2hhcjpzdHJpbmcsIHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucGllY2VMYXllci5hZGRQaWVjZShmZW5DaGFyLCBzcXVhcmVLZXkpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlUGllY2Uoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5waWVjZUxheWVyLnJlbW92ZVBpZWNlKHNxdWFyZUtleSk7XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHRTb3VyY2UoZnJvbTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5oaWdobGlnaHRTb3VyY2UoZnJvbSk7XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHRUYXJnZXQodG86c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmJvYXJkTGF5ZXIuaGlnaGxpZ2h0VGFyZ2V0KHRvKTtcclxuICAgIH1cclxuICAgIGNsZWFyU291cmNlQW5kVGFyZ2V0SGlnaGxpZ2h0cygpe1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5jbGVhclNvdXJjZUFuZFRhcmdldEhpZ2hsaWdodHMoKTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFNvdXJjZUFuZFRhcmdldChmcm9tOnN0cmluZywgdG86c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmJvYXJkTGF5ZXIuaGlnaGxpZ2h0U291cmNlQW5kVGFyZ2V0KGZyb20sIHRvKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgU2hhcmVkIGZyb20gXCIuLi9TaGFyZWRcIjtcclxuXHJcbmludGVyZmFjZSBBcnJvdyB7XHJcbiAgICBmcm9tOnN0cmluZyxcclxuICAgIHRvOnN0cmluZ1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFycm93TGF5ZXJ7XHJcbiAgICBwcml2YXRlIHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudDtcclxuICAgIHByaXZhdGUgZ3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHN0cm9rZVdpZHRoID0gMjA7XHJcbiAgICBwcml2YXRlIHJpZ2h0Q2xpY2tlZFNxdWFyZUtleTpzdHJpbmd8bnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGlzUm90YXRlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50QXJyb3dzOiBBcnJvd1tdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50LCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gc3ZnUm9vdDtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICBzdmdSb290LmFwcGVuZENoaWxkKGdyb3VwKTtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRBcnJvd3MuZm9yRWFjaChhcnJvdyA9PntcclxuICAgICAgICAgICAgdGhpcy5kcmF3QXJyb3coYXJyb3cuZnJvbSwgYXJyb3cudG8pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSA9IHNxdWFyZUtleTtcclxuICAgIH1cclxuICAgIG9uTGVmdEJ1dHRvbkRvd24oKXtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJyb3dzID0gW107XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uVXAoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ICYmIHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ICE9PSBzcXVhcmVLZXkpe1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdBcnJvdyh0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSwgc3F1YXJlS2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRyYXdBcnJvdyhmcm9tU3F1YXJlOnN0cmluZywgdG9TcXVhcmU6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRBcnJvd3MucHVzaCh7ZnJvbTpmcm9tU3F1YXJlLCB0bzp0b1NxdWFyZX0pO1xyXG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BvbHlnb24nKTtcclxuICAgICAgICBsZXQgcG9pbnQxID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50MiA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDMgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQ0ID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50NSA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDYgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQ3ID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcblxyXG4gICAgICAgIGxldCBmcm9tID0gdGhpcy5nZXRSZWxhdGl2ZUNlbnRlcihmcm9tU3F1YXJlKTtcclxuICAgICAgICBsZXQgdG8gPSB0aGlzLmdldFJlbGF0aXZlQ2VudGVyKHRvU3F1YXJlKTtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3codG8ueCAtIGZyb20ueCwgMikgKyBNYXRoLnBvdyh0by55IC1mcm9tLnksIDIpKTtcclxuICAgICAgICBsZXQgc2hvcnRlbkRpc3RhbmNlID0gMzA7XHJcbiAgICAgICAgbGV0IGNlbnRlciA9IHsgeDogKGZyb20ueCArIHRvLngpLzIsIHk6IChmcm9tLnkgKyB0by55KS8yIH07XHJcbiAgICAgICAgbGV0IHRyaWFuZ2xlU2lkZUxlbmd0aCA9IDQwO1xyXG4gICAgICAgIGxldCBhID0gdHJpYW5nbGVTaWRlTGVuZ3RoIC8gMjtcclxuICAgICAgICBsZXQgYyA9IHRyaWFuZ2xlU2lkZUxlbmd0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0T2ZUcmlhbmdsZSA9IE1hdGguc3FydChNYXRoLnBvdyhjLCAyKSAtIE1hdGgucG93KGEsMikpO1xyXG5cclxuICAgICAgICBwb2ludDEueCA9IGNlbnRlci54IC0gKGRpc3RhbmNlIC8gMikgKyBzaG9ydGVuRGlzdGFuY2U7XHJcbiAgICAgICAgcG9pbnQxLnkgPSBjZW50ZXIueSAtIHRoaXMuc3Ryb2tlV2lkdGggLyAyO1xyXG5cclxuICAgICAgICBwb2ludDIueCA9IHBvaW50MS54O1xyXG4gICAgICAgIHBvaW50Mi55ID0gcG9pbnQxLnkgKyB0aGlzLnN0cm9rZVdpZHRoO1xyXG5cclxuICAgICAgICBwb2ludDMueCA9IHBvaW50Mi54ICsgZGlzdGFuY2UgLSBoZWlnaHRPZlRyaWFuZ2xlIC0gc2hvcnRlbkRpc3RhbmNlO1xyXG4gICAgICAgIHBvaW50My55ID0gcG9pbnQyLnk7XHJcblxyXG4gICAgICAgIHBvaW50NC54ID0gcG9pbnQzLng7XHJcbiAgICAgICAgcG9pbnQ0LnkgPSBwb2ludDMueSArICgodHJpYW5nbGVTaWRlTGVuZ3RoIC8gMikgLSAodGhpcy5zdHJva2VXaWR0aCAvIDIpKTtcclxuXHJcbiAgICAgICAgcG9pbnQ1LnggPSBwb2ludDQueCArIGhlaWdodE9mVHJpYW5nbGU7XHJcbiAgICAgICAgcG9pbnQ1LnkgPSBjZW50ZXIueTtcclxuXHJcbiAgICAgICAgcG9pbnQ2LnggPSBwb2ludDQueDtcclxuICAgICAgICBwb2ludDYueSA9IHBvaW50NC55IC0gdHJpYW5nbGVTaWRlTGVuZ3RoO1xyXG5cclxuICAgICAgICBwb2ludDcueCA9IHBvaW50My54O1xyXG4gICAgICAgIHBvaW50Ny55ID0gcG9pbnQzLnkgLSB0aGlzLnN0cm9rZVdpZHRoO1xyXG5cclxuICAgICAgICBsZXQgZGVsdGFYID0gdG8ueCAtIGZyb20ueDtcclxuICAgICAgICBsZXQgZGVsdGFZID0gdG8ueSAtIGZyb20ueTtcclxuXHJcbiAgICAgICAgbGV0IHJhZGlhbiA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpO1xyXG4gICAgICAgIGxldCBkZWdyZWVzID0gcmFkaWFuICogMTgwIC8gTWF0aC5QSTtcclxuXHJcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZGVncmVlcyArIFwiIFwiICsgY2VudGVyLngudG9TdHJpbmcoKSArIFwiIFwiICsgY2VudGVyLnkudG9TdHJpbmcoKSArIFwiKVwiKTtcclxuICAgICAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXJyb3dcIik7XHJcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwicmdiYSgyNTUsIDE3MCwgMCwgMC44KVwiKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50MSk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDIpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQzKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50NCk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDUpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQ2KTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50Nyk7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChwb2x5Z29uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UmVsYXRpdmVDZW50ZXIoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgbGV0IGNoYXIgPSBzcXVhcmVLZXlbMF07XHJcbiAgICAgICAgbGV0IGRpZ2l0ID0gc3F1YXJlS2V5WzFdO1xyXG4gICAgICAgIGxldCB4ID0gU2hhcmVkLmdldEhvcml6b250YWxJbmRleChjaGFyLCB0aGlzLmlzUm90YXRlZCkgKiAxMDAgKyA1MDtcclxuICAgICAgICBsZXQgeSA9IFNoYXJlZC5nZXRWZXJ0aWNhbEluZGV4KGRpZ2l0LCB0aGlzLmlzUm90YXRlZCkgKiAxMDAgKyA1MDtcclxuICAgICAgICByZXR1cm4geyB4LCB5IH07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgU1ZHU3F1YXJlIGZyb20gXCIuLi9TcXVhcmVGYWN0b3J5XCI7XHJcbmltcG9ydCBTaGFyZWQgZnJvbSBcIi4uL1NoYXJlZFwiO1xyXG5cclxuaW50ZXJmYWNlIEhpZ2hsaWdodHtcclxuICAgIHNxdWFyZUtleTpzdHJpbmcsXHJcbiAgICB0eXBlOnN0cmluZztcclxuICAgIHJlY3Q6U1ZHUmVjdEVsZW1lbnQ7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9hcmRMYXllcntcclxuICAgIHByaXZhdGUgc3ZnUm9vdDpTVkdTVkdFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuICAgIHByaXZhdGUgc291cmNlSGlnaGxpZ2h0OkhpZ2hsaWdodDtcclxuICAgIHByaXZhdGUgdGFyZ2V0SGlnaGxpZ2h0OkhpZ2hsaWdodDtcclxuICAgIHByaXZhdGUgc291cmNlVGFyZ2V0R3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHNvdXJjZUNvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCA1MSwgMC4zKVwiO1xyXG4gICAgcHJpdmF0ZSB0YXJnZXRDb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgNTEsIDAuNClcIjtcclxuICAgIHByaXZhdGUgcmlnaHRDbGlja0NvbG9yID0gXCJyZ2IoMjM1LCA5NywgODAsIDAuOClcIjtcclxuICAgIHByaXZhdGUgcmlnaHRDbGlja0dyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByaWdodENsaWNrczpSZWNvcmQ8c3RyaW5nLCBIaWdobGlnaHR8bnVsbD4gPSB7fTtcclxuICAgIHByaXZhdGUgcmlnaHRDbGlja2VkU3F1YXJlS2V5OnN0cmluZ3xudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QgPSBzdmdSb290O1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QuYXBwZW5kQ2hpbGQoZ3JvdXApO1xyXG5cclxuICAgICAgICBsZXQgY29sb3JzID0gW1wibFwiLCBcImRcIiwgXCJsXCIsIFwiZFwiLCBcImxcIiwgXCJkXCIsIFwibFwiLCBcImRcIl07XHJcblxyXG4gICAgICAgIFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XS5mb3JFYWNoKHkgPT57XHJcbiAgICAgICAgICAgIFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XS5mb3JFYWNoKCh4LCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUJvYXJkUmVjdCh4LCB5LCBjb2xvcnNbaW5kZXhdKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb2xvcnMgPSBjb2xvcnMucmV2ZXJzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc291cmNlVGFyZ2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VUYXJnZXRHcm91cCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zb3VyY2VIaWdobGlnaHQgPSB7c3F1YXJlS2V5OiBcImE4XCIsIHR5cGU6IFwic291cmNlXCIsIHJlY3Q6IFNWR1NxdWFyZS5jcmVhdGVSZWN0KDAsMCl9O1xyXG4gICAgICAgIHRoaXMudGFyZ2V0SGlnaGxpZ2h0ID0ge3NxdWFyZUtleTogXCJhN1wiLCB0eXBlOiBcInRhcmdldFwiLCByZWN0OiBTVkdTcXVhcmUuY3JlYXRlUmVjdCgxLDApfTtcclxuICAgICAgICB0aGlzLnNvdXJjZUhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKTtcclxuICAgICAgICB0aGlzLnRhcmdldEhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKTtcclxuICAgICAgICB0aGlzLnNvdXJjZVRhcmdldEdyb3VwLmFwcGVuZENoaWxkKHRoaXMuc291cmNlSGlnaGxpZ2h0LnJlY3QpO1xyXG4gICAgICAgIHRoaXMuc291cmNlVGFyZ2V0R3JvdXAuYXBwZW5kQ2hpbGQodGhpcy50YXJnZXRIaWdobGlnaHQucmVjdCk7XHJcblxyXG4gICAgICAgIHRoaXMucmlnaHRDbGlja0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFwcGVuZENoaWxkKHRoaXMucmlnaHRDbGlja0dyb3VwKTtcclxuICAgIH1cclxuICAgIG9uTGVmdEJ1dHRvbkRvd24oKXtcclxuICAgICAgICB0aGlzLmNsZWFyQWxsSGlnaGxpZ2h0cygpO1xyXG4gICAgfVxyXG4gICAgb25SaWdodEJ1dHRvbkRvd24oc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgPSBzcXVhcmVLZXk7XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uVXAoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ICYmIHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ID09PSBzcXVhcmVLZXkpe1xyXG4gICAgICAgICAgICBsZXQgcmlnaHRDbGlja2VkID0gdGhpcy5yaWdodENsaWNrc1tzcXVhcmVLZXldO1xyXG4gICAgICAgICAgICBpZiAocmlnaHRDbGlja2VkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDbGlja0dyb3VwLnJlbW92ZUNoaWxkKHJpZ2h0Q2xpY2tlZC5yZWN0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDbGlja3Nbc3F1YXJlS2V5XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUmlnaHRDbGlja0hpZ2hsaWdodChzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc291cmNlSGlnaGxpZ2h0KTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMudGFyZ2V0SGlnaGxpZ2h0KTtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMucmlnaHRDbGlja3MpLmZvckVhY2gocmlnaHRDbGljayA9PntcclxuICAgICAgICAgICAgaWYgKHJpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQb3NpdGlvbihyaWdodENsaWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0U291cmNlQW5kVGFyZ2V0KGZyb206c3RyaW5nLCB0bzpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJBbGxIaWdobGlnaHRzKCk7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRTb3VyY2UoZnJvbSk7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUYXJnZXQodG8pO1xyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0U291cmNlKGZyb206c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnNvdXJjZUhpZ2hsaWdodC5zcXVhcmVLZXkgPSBmcm9tO1xyXG4gICAgICAgIHRoaXMuc291cmNlSGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLnNvdXJjZUNvbG9yKTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc291cmNlSGlnaGxpZ2h0KTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodFRhcmdldCh0bzpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMudGFyZ2V0SGlnaGxpZ2h0LnNxdWFyZUtleSA9IHRvO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0SGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLnRhcmdldENvbG9yKTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMudGFyZ2V0SGlnaGxpZ2h0KTtcclxuICAgIH1cclxuICAgIGNsZWFyU291cmNlQW5kVGFyZ2V0SGlnaGxpZ2h0cygpe1xyXG4gICAgICAgIHRoaXMuc291cmNlSGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0SGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzaG93VGFyZ2V0T3JTb3VyY2Uoc3F1YXJlS2V5OnN0cmluZywgaGlnaGxpZ2h0OkhpZ2hsaWdodCwgY29sb3I6c3RyaW5nKXtcclxuICAgICAgICBoaWdobGlnaHQuc3F1YXJlS2V5ID0gc3F1YXJlS2V5O1xyXG4gICAgICAgIGhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oaGlnaGxpZ2h0KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2xlYXJBbGxIaWdobGlnaHRzKCl7XHJcbiAgICAgICAgdGhpcy5jbGVhclNvdXJjZUFuZFRhcmdldEhpZ2hsaWdodHMoKTtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tzID0ge307XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrR3JvdXAuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlUmlnaHRDbGlja0hpZ2hsaWdodChzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBsZXQgY29yZHMgPSBTaGFyZWQuZ2V0Q29yZGluYXRlc0J5U3F1YXJlS2V5KHNxdWFyZUtleSwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIGxldCByZWN0ID0gU1ZHU3F1YXJlLmNyZWF0ZVJlY3QoY29yZHMueCwgY29yZHMueSk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMucmlnaHRDbGlja0NvbG9yKTtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tHcm91cC5hcHBlbmRDaGlsZChyZWN0KTtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tzW3NxdWFyZUtleV0gPSB7c3F1YXJlS2V5LCB0eXBlOiBcIlJpZ2h0Q2xpY2tcIiwgcmVjdH07XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFBvc2l0aW9uKGhpZ2hsaWdodDpIaWdobGlnaHQpe1xyXG4gICAgICAgIGxldCBjb3JkID0gU2hhcmVkLmdldENvcmRpbmF0ZXNCeVNxdWFyZUtleShoaWdobGlnaHQuc3F1YXJlS2V5LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgaGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwieFwiLCAoY29yZC54ICogMTAwKS50b1N0cmluZygpKTtcclxuICAgICAgICBoaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIChjb3JkLnkgKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVCb2FyZFJlY3QoeDpudW1iZXIsIHk6bnVtYmVyLCBjb2xvcjpzdHJpbmcpe1xyXG4gICAgICAgIGxldCByZWN0ID0gU1ZHU3F1YXJlLmNyZWF0ZVJlY3QoeCwgeSk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yID09PSBcImxcIiA/IFwicmdiKDIzMywyMzcsMjA0KVwiIDogXCJyZ2IoMTE5LDE1Myw4NClcIik7XHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Jkc0xheWVye1xyXG4gICAgcHJpdmF0ZSBncm91cDpTVkdHRWxlbWVudDtcclxuICAgIHByaXZhdGUgaG9yaXpvbnRhbEdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB2ZXJ0aWNhbEdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcIkhlbHZldGljYVwiKTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZShcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZ2IoMzAsMzAsMzBcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmQodGhpcy5ncm91cCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy52ZXJ0aWNhbEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5ob3Jpem9udGFsR3JvdXApO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy52ZXJ0aWNhbEdyb3VwKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsR3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDg2LCA3OTUuNSlcIik7XHJcbiAgICAgICAgdGhpcy52ZXJ0aWNhbEdyb3VwLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSg1LCAxOClcIik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0SG9yaXpvbnRhbENvcmRzKGlzUm90YXRlZCkuZm9yRWFjaCgobGV0dGVyLCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgICAgICBncm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoaW5kZXggKiAxMDApLnRvU3RyaW5nKCkgKyBcIiwwKVwiKTtcclxuICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsR3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwidGV4dFwiKTtcclxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJzY2FsZSgwLjkpXCIpO1xyXG4gICAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbGV0dGVyO1xyXG4gICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdldFZlcnRpY2FsQ29yZHMoaXNSb3RhdGVkKS5mb3JFYWNoKChudW1iZXIsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgICAgIGdyb3VwLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgKyAoaW5kZXggKiAxMDApLnRvU3RyaW5nKCkgKyBcIilcIik7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxHcm91cC5hcHBlbmRDaGlsZChncm91cCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbnVtYmVyO1xyXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInNjYWxlKDEpXCIpO1xyXG4gICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0SG9yaXpvbnRhbENvcmRzKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgaG9yaXpvbnRhbENvcmRzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIl07XHJcbiAgICAgICAgcmV0dXJuIGlzUm90YXRlZCA/IGhvcml6b250YWxDb3Jkcy5yZXZlcnNlKCkgOiBob3Jpem9udGFsQ29yZHM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZlcnRpY2FsQ29yZHMoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCB2ZXJ0aWNhbENvcmRzID0gW1wiOFwiLCBcIjdcIiwgXCI2XCIsIFwiNVwiLCBcIjRcIiwgXCIzXCIsIFwiMlwiLCBcIjFcIl07XHJcbiAgICAgICAgcmV0dXJuIGlzUm90YXRlZCA/IHZlcnRpY2FsQ29yZHMucmV2ZXJzZSgpIDogdmVydGljYWxDb3JkcztcclxuICAgIH1cclxuICAgIHJvdGF0ZShpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgbGV0IGxldHRlcnMgPSB0aGlzLmdldEhvcml6b250YWxDb3Jkcyhpc1JvdGF0ZWQpO1xyXG4gICAgICAgIGxldCBudW1iZXJzID0gdGhpcy5nZXRWZXJ0aWNhbENvcmRzKGlzUm90YXRlZCk7XHJcbiAgICAgICAgQXJyYXkuZnJvbSh0aGlzLmhvcml6b250YWxHcm91cC5jaGlsZHJlbikuZm9yRWFjaCgoY2hpbGQsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgY2hpbGQuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBsZXR0ZXJzW2luZGV4XTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMudmVydGljYWxHcm91cC5jaGlsZHJlbikuZm9yRWFjaCgoY2hpbGQsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgY2hpbGQuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBudW1iZXJzW2luZGV4XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBQaWVjZSBmcm9tIFwiLi4vUGllY2VcIjtcclxuaW1wb3J0IFBpZWNlRmFjdG9yeSBmcm9tIFwiLi4vUGllY2VGYWN0b3J5XCI7XHJcbmltcG9ydCBTaGFyZWQgZnJvbSBcIi4uL1NoYXJlZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGllY2VMYXllcntcclxuICAgIHByaXZhdGUgZ3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGlzUm90YXRlZDpib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBwb3NpdGlvbnM6UmVjb3JkPHN0cmluZywgUGllY2V8bnVsbD4gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmRDaGlsZCh0aGlzLmdyb3VwKTtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgIH1cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSB7fTtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBnZXRQaWVjZShzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbc3F1YXJlS2V5XTtcclxuICAgIH1cclxuICAgIGFkZFBpZWNlKGZlbkNoYXI6c3RyaW5nLCBzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBsZXQgZyA9IFBpZWNlRmFjdG9yeS5nZXQoZmVuQ2hhcik7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChnKTtcclxuICAgICAgICBsZXQgcGllY2UgPSB7ZWxlbWVudDpnLCBmZW5DaGFyLCBzcXVhcmVLZXl9O1xyXG4gICAgICAgIHRoaXMuc2V0UGllY2VQb3NpdGlvbihwaWVjZSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVQaWVjZShzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aGlzLnBvc2l0aW9uc1tzcXVhcmVLZXldO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAucmVtb3ZlQ2hpbGQocGllY2UhLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zW3NxdWFyZUtleV0gPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICBsZXQgcGllY2VzID0gT2JqZWN0LnZhbHVlcyh0aGlzLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSB7fTtcclxuICAgICAgICBwaWVjZXMuZm9yRWFjaChwaWVjZSA9PntcclxuICAgICAgICAgICAgaWYgKHBpZWNlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UGllY2VQb3NpdGlvbihwaWVjZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UGllY2VQb3NpdGlvbihwaWVjZTpQaWVjZSl7XHJcbiAgICAgICAgbGV0IHNxdWFyZUtleSA9IHBpZWNlLnNxdWFyZUtleTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uc1tzcXVhcmVLZXldID0gcGllY2U7XHJcbiAgICAgICAgbGV0IGNvcmRzID0gU2hhcmVkLmdldENvcmRpbmF0ZXNCeVNxdWFyZUtleShzcXVhcmVLZXksIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICBwaWVjZS5lbGVtZW50LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIGNvcmRzLnggKiAxMDAgKyBcIixcIiArIGNvcmRzLnkgKiAxMDAgKyBcIilcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQm9hcmRMYXllciBmcm9tIFwiLi9MYXllcnMvQm9hcmRMYXllclwiO1xyXG5pbXBvcnQgQXJyb3dMYXllciBmcm9tIFwiLi9MYXllcnMvQXJyb3dMYXllclwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuL1NoYXJlZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW91c2VFdmVudHN7XHJcbiAgICBzdmdSb290OlNWR1NWR0VsZW1lbnQ7XHJcbiAgICBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGJvYXJkTGF5ZXI6Qm9hcmRMYXllciwgYXJyb3dMYXllcjpBcnJvd0xheWVyLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gc3ZnUm9vdDtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuXHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGV2ZW50Ok1vdXNlRXZlbnQpID0+IFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGlzUmlnaHRDbGljayA9IGV2ZW50LmJ1dHRvbiAmJiBldmVudC5idXR0b24gPT0gMjtcclxuICAgICAgICAgICAgaWYgKGlzUmlnaHRDbGljayl7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3F1YXJlS2V5ID0gU2hhcmVkLmdldFNxdWFyZUJ5Q3Vyc29yUG9zaXRpb24odGhpcy5zdmdSb290LCBldmVudCwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYm9hcmRMYXllci5vblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICAgICAgYXJyb3dMYXllci5vblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBib2FyZExheWVyLm9uTGVmdEJ1dHRvbkRvd24oKTtcclxuICAgICAgICAgICAgICAgIGFycm93TGF5ZXIub25MZWZ0QnV0dG9uRG93bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmIChpc1JpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgbGV0IHNxdWFyZUtleSA9IFNoYXJlZC5nZXRTcXVhcmVCeUN1cnNvclBvc2l0aW9uKHRoaXMuc3ZnUm9vdCwgZXZlbnQsIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgICAgIGJvYXJkTGF5ZXIub25SaWdodEJ1dHRvblVwKHNxdWFyZUtleSk7XHJcbiAgICAgICAgICAgICAgICBhcnJvd0xheWVyLm9uUmlnaHRCdXR0b25VcChzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpICk7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgYmlzaG9wIGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvYi5qc29uXCI7XHJcbmltcG9ydCAqIGFzIGtpbmcgZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9rLmpzb25cIjtcclxuaW1wb3J0ICogYXMga25pZ2h0IGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvbi5qc29uXCI7XHJcbmltcG9ydCAqIGFzIHBhd24gZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9wLmpzb25cIjtcclxuaW1wb3J0ICogYXMgcXVlZW4gZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9xLmpzb25cIjtcclxuaW1wb3J0ICogYXMgcm9vayBmcm9tIFwiLi9hc3NldHMvcGllY2VzL3IuanNvblwiO1xyXG5cclxuY29uc3QgcGllY2VTVkdEYXRhOlJlY29yZDxzdHJpbmcsIEdyb3VwPiA9IHt9O1xyXG5waWVjZVNWR0RhdGFbXCJwXCJdID0gcGF3bi5nIGFzIEdyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJyXCJdID0gcm9vay5nIGFzIEdyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJuXCJdID0ga25pZ2h0LmcgYXMgR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcImJcIl0gPSBiaXNob3AuZyBhcyBHcm91cDtcclxucGllY2VTVkdEYXRhW1wicVwiXSA9IHF1ZWVuLmcgYXMgR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcImtcIl0gPSBraW5nLmcgYXMgR3JvdXA7XHJcblxyXG5pbnRlcmZhY2UgR3JvdXB7XHJcbiAgICBnOiBHcm91cHx1bmRlZmluZWQ7XHJcbiAgICB0cmFuc2Zvcm06c3RyaW5nfHVuZGVmaW5lZDtcclxuICAgIHN0eWxlOnN0cmluZ1tdfHVuZGVmaW5lZDtcclxuICAgIHBhdGg6UGF0aFtdfHVuZGVmaW5lZHxudWxsO1xyXG4gICAgY2lyY2xlOkNpcmNsZVtdfHVuZGVmaW5lZDtcclxufVxyXG5pbnRlcmZhY2UgUGF0aHtcclxuICAgIHN0eWxlOnN0cmluZ1tdfHVuZGVmaW5lZDtcclxuICAgIGQ6c3RyaW5nO1xyXG4gICAgY29sb3JJbmRleDpudW1iZXJ8dW5kZWZpbmVkO1xyXG59XHJcbmludGVyZmFjZSBDaXJjbGV7XHJcbiAgICBjeDpzdHJpbmc7XHJcbiAgICBjeTpzdHJpbmc7XHJcbiAgICByOnN0cmluZztcclxufVxyXG5jb25zdCBwaWVjZVR5cGVzOlJlY29yZDxzdHJpbmcsIFNWR0dFbGVtZW50PiA9IHt9O1xyXG5bXCJwXCIsXCJuXCIsXCJiXCIsXCJyXCIsXCJxXCIsXCJrXCIsXCJQXCIsXCJOXCIsXCJCXCIsXCJSXCIsXCJRXCIsXCJLXCJdLmZvckVhY2goZmVuQ2hhciA9PntcclxuICAgIGxldCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICBsZXQgZGF0YSA9IHBpZWNlU1ZHRGF0YVtmZW5DaGFyLnRvTG93ZXJDYXNlKCldO1xyXG4gICAgbGV0IGNvbG9yID0gZmVuQ2hhciA9PT0gZmVuQ2hhci50b0xvd2VyQ2FzZSgpID8gMCA6IDE7XHJcbiAgICBsb2FkQ2hpbGRyZW4oZywgZGF0YSwgY29sb3IpO1xyXG4gICAgcGllY2VUeXBlc1tmZW5DaGFyXSA9IGc7XHJcbn0pO1xyXG5mdW5jdGlvbiBsb2FkQ2hpbGRyZW4oZzpTVkdHRWxlbWVudCwgZ3JvdXA6R3JvdXAsIGNvbG9yOm51bWJlcil7XHJcbiAgICBpZiAoZ3JvdXAudHJhbnNmb3JtKXtcclxuICAgICAgICBnLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBncm91cC50cmFuc2Zvcm0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLnN0eWxlICYmIGdyb3VwLnN0eWxlW2NvbG9yXSl7XHJcbiAgICAgICAgZy5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBncm91cC5zdHlsZVtjb2xvcl0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLmNpcmNsZSl7XHJcbiAgICAgICAgZ3JvdXAuY2lyY2xlLmZvckVhY2goY2lyY2xlID0+e1xyXG4gICAgICAgICAgICBsZXQgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnY2lyY2xlJyk7XHJcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKFwiY3hcIiwgY2lyY2xlLmN4KTtcclxuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjaXJjbGUuY3kpO1xyXG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShcInJcIiwgY2lyY2xlLnIpO1xyXG4gICAgICAgICAgICBnLmFwcGVuZENoaWxkKGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLnBhdGgpe1xyXG4gICAgICAgIGdyb3VwLnBhdGguZm9yRWFjaChwYXRoID0+e1xyXG4gICAgICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xyXG4gICAgICAgICAgICBpZiAocGF0aC5jb2xvckluZGV4ID09PSB1bmRlZmluZWQgfHwgcGF0aC5jb2xvckluZGV4ID09PSBjb2xvcil7XHJcbiAgICAgICAgICAgICAgICBwLnNldEF0dHJpYnV0ZShcImRcIiwgcGF0aC5kKTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLnN0eWxlKXtcclxuICAgICAgICAgICAgICAgICAgICBwLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIHBhdGguc3R5bGVbY29sb3JdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmIChncm91cC5nKXtcclxuICAgICAgICBsZXQgY2hpbGRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIGcuYXBwZW5kQ2hpbGQoY2hpbGRHcm91cCk7XHJcbiAgICAgICAgbG9hZENoaWxkcmVuKGNoaWxkR3JvdXAsIGdyb3VwLmcsIGNvbG9yKTtcclxuICAgIH1cclxufVxyXG5uYW1lc3BhY2UgUGllY2VGYWN0b3J5e1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldChmZW5DaGFyOnN0cmluZyk6U1ZHR0VsZW1lbnR7XHJcbiAgICAgICAgcmV0dXJuIHBpZWNlVHlwZXNbZmVuQ2hhcl0uY2xvbmVOb2RlKHRydWUpIGFzIFNWR0dFbGVtZW50O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFBpZWNlRmFjdG9yeTtcclxuIiwibmFtZXNwYWNlIFNoYXJlZHtcclxuICAgIGNvbnN0IHNxdWFyZUtleXMgPSBbXCJhOFwiLCBcImI4XCIsIFwiYzhcIiwgXCJkOFwiLCBcImU4XCIsIFwiZjhcIiwgXCJnOFwiLCBcImg4XCIsIFwiYTdcIiwgXCJiN1wiLCBcImM3XCIsIFwiZDdcIiwgXCJlN1wiLCBcImY3XCIsIFwiZzdcIiwgXCJoN1wiLCBcImE2XCIsIFwiYjZcIiwgXCJjNlwiLCBcImQ2XCIsIFwiZTZcIiwgXCJmNlwiLCBcImc2XCIsIFwiaDZcIiwgXCJhNVwiLCBcImI1XCIsIFwiYzVcIiwgXCJkNVwiLCBcImU1XCIsIFwiZjVcIiwgXCJnNVwiLCBcImg1XCIsIFwiYTRcIiwgXCJiNFwiLCBcImM0XCIsIFwiZDRcIiwgXCJlNFwiLCBcImY0XCIsIFwiZzRcIiwgXCJoNFwiLCBcImEzXCIsIFwiYjNcIiwgXCJjM1wiLCBcImQzXCIsIFwiZTNcIiwgXCJmM1wiLCBcImczXCIsIFwiaDNcIiwgXCJhMlwiLCBcImIyXCIsIFwiYzJcIiwgXCJkMlwiLCBcImUyXCIsIFwiZjJcIiwgXCJnMlwiLCBcImgyXCIsIFwiYTFcIiwgXCJiMVwiLCBcImMxXCIsIFwiZDFcIiwgXCJlMVwiLCBcImYxXCIsIFwiZzFcIiwgXCJoMVwiXTtcclxuICAgIGNvbnN0IGhvcml6b250YWwgPSBbXCJhXCIsIFwiYlwiLCBcImNcIiwgXCJkXCIsIFwiZVwiLCBcImZcIiwgXCJnXCIsIFwiaFwiXTtcclxuICAgIGNvbnN0IHZlcnRpY2FsID0gW1wiOFwiLCBcIjdcIiwgXCI2XCIsIFwiNVwiLCBcIjRcIiwgXCIzXCIsIFwiMlwiLCBcIjFcIl07XHJcbiAgICBcclxuICAgIGV4cG9ydCBjb25zdCBzdGFydEZFTiA9IFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIjtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3F1YXJlS2V5QnlJbmRleGVzKGhvcml6b250YWxJbmRleDpudW1iZXIsIHZlcnRpY2FsSW5kZXg6bnVtYmVyLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGxldHRlckluZGV4ID0gaXNSb3RhdGVkID8gNyAtIGhvcml6b250YWxJbmRleCA6IGhvcml6b250YWxJbmRleDtcclxuICAgICAgICBsZXQgZGlnaXRJbmRleCA9IGlzUm90YXRlZCA/IDcgLSB2ZXJ0aWNhbEluZGV4IDogdmVydGljYWxJbmRleDtcclxuICAgICAgICByZXR1cm4gaG9yaXpvbnRhbFtsZXR0ZXJJbmRleF0gKyB2ZXJ0aWNhbFtkaWdpdEluZGV4XTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTcXVhcmVLZXlCeUluZGV4KGluZGV4Om51bWJlciwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpID0gaXNSb3RhdGVkID8gNjMgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgICAgIHJldHVybiBzcXVhcmVLZXlzW2ldO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRJbmRleE9mU3F1YXJlS2V5KHNxdWFyZUtleTpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgaW5kZXggPSBzcXVhcmVLZXlzLmluZGV4T2Yoc3F1YXJlS2V5KTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNjMgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEhvcml6b250YWxJbmRleChzcXVhcmVMZXR0ZXI6c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gaG9yaXpvbnRhbC5pbmRleE9mKHNxdWFyZUxldHRlcik7XHJcbiAgICAgICAgcmV0dXJuIGlzUm90YXRlZCA/IDcgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnRpY2FsSW5kZXgoc3F1YXJlTnVtYmVyOnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpbmRleCA9IHZlcnRpY2FsLmluZGV4T2Yoc3F1YXJlTnVtYmVyKTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q29yZGluYXRlc0J5U3F1YXJlS2V5KHNxdWFyZUtleTpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgeCA9IGdldEhvcml6b250YWxJbmRleChzcXVhcmVLZXlbMF0sIGlzUm90YXRlZCk7XHJcbiAgICAgICAgbGV0IHkgPSBnZXRWZXJ0aWNhbEluZGV4KHNxdWFyZUtleVsxXSwgaXNSb3RhdGVkKTtcclxuICAgICAgICByZXR1cm4geyB4LCB5IH07XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3F1YXJlQnlDdXJzb3JQb3NpdGlvbihib2FyZFNWRzpTVkdTVkdFbGVtZW50LCBldmVudDpNb3VzZUV2ZW50LCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IHN2Z1BhcmVudCA9IGJvYXJkU1ZHLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgbGV0IGJvYXJkV2lkdGhBbmRIZWlnaHQgPSBzdmdQYXJlbnQuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgbGV0IHNxdWFyZVdpZHRoQW5kSGVpZ2h0ID0gYm9hcmRXaWR0aEFuZEhlaWdodCAvIDg7XHJcbiAgICAgICAgbGV0IGJvYXJkQ29vcmRpbmF0ZVggPSBldmVudC5jbGllbnRYIC0gc3ZnUGFyZW50Lm9mZnNldExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICBsZXQgYm9hcmRDb29yZGluYXRlWSA9IGV2ZW50LmNsaWVudFkgLSBzdmdQYXJlbnQub2Zmc2V0VG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgICAgICBsZXQgc3F1YXJlSW5kZXhYPSBNYXRoLmZsb29yKGJvYXJkQ29vcmRpbmF0ZVggLyBzcXVhcmVXaWR0aEFuZEhlaWdodCk7XHJcbiAgICAgICAgbGV0IHNxdWFyZUluZGV4WSA9IE1hdGguZmxvb3IoYm9hcmRDb29yZGluYXRlWSAvIHNxdWFyZVdpZHRoQW5kSGVpZ2h0KTtcclxuICAgICAgICByZXR1cm4gZ2V0U3F1YXJlS2V5QnlJbmRleGVzKHNxdWFyZUluZGV4WCwgc3F1YXJlSW5kZXhZLCBpc1JvdGF0ZWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFNoYXJlZDtcclxuIiwibmFtZXNwYWNlIFNWR1NxdWFyZXtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZWN0KHg6bnVtYmVyLCB5Om51bWJlcil7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInhcIiwgKHggKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCAoeSAqIDEwMCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjEwMFwiKTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBcIjEwMFwiKTtcclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTVkdTcXVhcmUiLCJpbXBvcnQgQ2hlc3Nib2FyZCBmcm9tIFwiLi4vY2hlc3Nib2FyZC9DaGVzc2JvYXJkXCI7XHJcbmltcG9ydCBTaGFyZWQgZnJvbSBcIi4uL2NoZXNzYm9hcmQvU2hhcmVkXCI7XHJcbmltcG9ydCBQaWVjZSBmcm9tIFwiLi4vY2hlc3Nib2FyZC9QaWVjZVwiO1xyXG5pbXBvcnQgeyBNb3ZlIH0gZnJvbSBcImNoZXNzLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb257XHJcbiAgICBjaGVzc2JvYXJkOkNoZXNzYm9hcmQ7XHJcbiAgICBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuICAgIHRpbWVPdXRJZDpOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjaGVzc2JvYXJkOkNoZXNzYm9hcmQsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQgPSBjaGVzc2JvYXJkO1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgfVxyXG4gICAgY2FuY2VsQW5pbWF0aW9ucygpe1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVPdXRJZCk7XHJcbiAgICB9XHJcbiAgICBtb3ZlKG1vdmU6TW92ZSwgb25BbmltYXRpb25FbmQ6RnVuY3Rpb24pe1xyXG4gICAgICAgIGxldCBwaWVjZSA9IHRoaXMuY2hlc3Nib2FyZC5nZXRQaWVjZShtb3ZlLmZyb20pO1xyXG4gICAgICAgIGlmIChwaWVjZSl7XHJcbiAgICAgICAgICAgIGxldCBjYXN0bGluZ1Jvb2s6UGllY2V8dW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAobW92ZS5waWVjZSA9PT0gXCJrXCIgJiYgbW92ZS5zYW5bMF0gPT09IFwiT1wiKXtcclxuICAgICAgICAgICAgICAgIGxldCByb29rU3F1YXJlID0gbW92ZS5jb2xvciA9PT0gXCJ3XCIgPyAobW92ZS5zYW4gPT09IFwiTy1PXCIgPyBcImgxXCIgOiBcImExXCIpIDogKG1vdmUuc2FuID09PSBcIk8tT1wiID8gXCJoOFwiIDogXCJhOFwiKTtcclxuICAgICAgICAgICAgICAgIGNhc3RsaW5nUm9vayA9IHRoaXMuY2hlc3Nib2FyZC5nZXRQaWVjZShyb29rU3F1YXJlKSE7XHJcbiAgICAgICAgICAgICAgICBjYXN0bGluZ1Jvb2suZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSBcInRyYW5zZm9ybVwiO1xyXG4gICAgICAgICAgICAgICAgY2FzdGxpbmdSb29rLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gXCI4MDBtc1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBpZWNlLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gXCJ0cmFuc2Zvcm1cIjtcclxuICAgICAgICAgICAgcGllY2UuZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBcIjgwMG1zXCI7XHJcbiAgICAgICAgICAgIHRoaXMudGltZU91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGllY2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXN0bGluZ1Jvb2spe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVzdGluYXRpb24gPSBtb3ZlLmNvbG9yID09PSBcIndcIiA/IChtb3ZlLnNhbiA9PT0gXCJPLU9cIiA/IFwiZjFcIiA6IFwiZDFcIikgOiAobW92ZS5zYW4gPT09IFwiTy1PXCIgPyBcImY4XCI6IFwiZDhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb3Jkc1RvID0gU2hhcmVkLmdldENvcmRpbmF0ZXNCeVNxdWFyZUtleShkZXN0aW5hdGlvbiwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXN0bGluZ1Jvb2suZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7Y29yZHNUby54ICogMTIuNX0lLCAke2NvcmRzVG8ueSAqIDEyLjV9JSlgO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29yZHNUbyA9IFNoYXJlZC5nZXRDb3JkaW5hdGVzQnlTcXVhcmVLZXkobW92ZS50bywgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke2NvcmRzVG8ueCAqIDEyLjV9JSwgJHtjb3Jkc1RvLnkgKiAxMi41fSUpYDtcclxuICAgICAgICAgICAgICAgICAgICBwaWVjZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwaWVjZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5lbGVtZW50LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZS5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FzdGxpbmdSb29rKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXN0bGluZ1Jvb2suZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc3RsaW5nUm9vay5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFuaW1hdGlvbkVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgeyBvbmNlOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgIH0sMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBpZWNlRmFjdG9yeSBmcm9tIFwiLi4vY2hlc3Nib2FyZC9QaWVjZUZhY3RvcnlcIjtcclxuXHJcbmNvbnN0IHBpZWNlVHlwZXM6IFJlY29yZDxzdHJpbmcsIFNWR1NWR0VsZW1lbnQ+ID0ge307XHJcblxyXG5bXCJwXCIsXCJuXCIsXCJiXCIsXCJyXCIsXCJxXCIsXCJQXCIsXCJOXCIsXCJCXCIsXCJSXCIsXCJRXCJdLmZvckVhY2goZmVuQ2hhciA9PntcclxuICAgIGxldCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwic3ZnXCIpO1xyXG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMTAwIDEwMCcpO1xyXG4gICAgbGV0IHBpZWNlID0gUGllY2VGYWN0b3J5LmdldChmZW5DaGFyKTtcclxuICAgIHN2Zy5hcHBlbmRDaGlsZChwaWVjZSk7XHJcbiAgICBwaWVjZVR5cGVzW2ZlbkNoYXJdID0gc3ZnIGFzIFNWR1NWR0VsZW1lbnQ7XHJcbn0pO1xyXG5leHBvcnQgbmFtZXNwYWNlIENhcHR1cmVQaWVjZUZhY3Rvcnl7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0KGZlbkNoYXI6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gcGllY2VUeXBlc1tmZW5DaGFyXS5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHU1ZHRWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiIsImltcG9ydCBDaGVzc2JvYXJkIGZyb20gXCIuLi9jaGVzc2JvYXJkL0NoZXNzYm9hcmRcIjtcclxuaW1wb3J0IFNoYXJlZCBmcm9tIFwiLi4vY2hlc3Nib2FyZC9TaGFyZWRcIjtcclxuaW1wb3J0IHsgTW92ZSB9IGZyb20gXCJjaGVzcy5qc1wiO1xyXG5pbXBvcnQgUGxheWVySW5mbyBmcm9tIFwiLi9QbGF5ZXJJbmZvXCI7XHJcbmltcG9ydCBBbmltYXRpb24gZnJvbSBcIi4vQW5pbWF0aW9uXCI7XHJcbmltcG9ydCBcIi4vZ2FtZUJyb3dzZXIuY3NzXCI7XHJcbmltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVCcm93c2Vye1xyXG4gICAgY2hlc3Nib2FyZDpDaGVzc2JvYXJkO1xyXG4gICAgaXNSb3RhdGVkOmJvb2xlYW47XHJcbiAgICBwbGF5ZXJJbmZvOlBsYXllckluZm87XHJcbiAgICBtb3ZlczpNb3ZlW10gPSBbXTtcclxuICAgIGN1cnJlbnRNb3ZlSW5kZXggPSAwO1xyXG4gICAgYW5pbWF0aW9uOkFuaW1hdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6SFRNTEVsZW1lbnQsIGZlbjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQgPSBuZXcgQ2hlc3Nib2FyZChjb250YWluZXIsIGZlbiwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnBsYXllckluZm8gPSBuZXcgUGxheWVySW5mbyhjb250YWluZXIsIGZlbiwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24odGhpcy5jaGVzc2JvYXJkLCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLnBsYXllckluZm8ucm90YXRlKGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnJvdGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgbG9hZEdhbWUoZ2FtZTpHYW1lKXtcclxuICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc2V0RmVuKFNoYXJlZC5zdGFydEZFTiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJbmZvLnNldFBsYXllck5hbWVzKGdhbWUuYmxhY2tQbGF5ZXIsIGdhbWUud2hpdGVQbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMucGxheWVySW5mby5zZXRTY29yZUFuZENhcHV0ZXJlQnlGZW4oU2hhcmVkLnN0YXJ0RkVOKTtcclxuICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICB0aGlzLmN1cnJlbnRNb3ZlSW5kZXggPSAtMTtcclxuICAgIH1cclxuICAgIHN0ZXBGb3J3YXJkKCl7XHJcbiAgICAgICAgbGV0IG1vdmUgPSB0aGlzLm1vdmVzW3RoaXMuY3VycmVudE1vdmVJbmRleCArMV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmNsZWFyU291cmNlQW5kVGFyZ2V0SGlnaGxpZ2h0cygpO1xyXG4gICAgICAgIHRoaXMuY2hlc3Nib2FyZC5oaWdobGlnaHRTb3VyY2UobW92ZS5mcm9tKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5tb3ZlKG1vdmUsICgpID0+e1xyXG4gICAgICAgICAgICAvL09uQW5pbWF0aW9uRW5kXHJcbiAgICAgICAgICAgIGlmIChtb3ZlLmNhcHR1cmVkKXtcclxuICAgICAgICAgICAgICAgIGxldCBwaWVjZSA9IHRoaXMuY2hlc3Nib2FyZC5nZXRQaWVjZShtb3ZlLnRvKSE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllckluZm8uYWRkQ2FwdHVyZShwaWVjZS5mZW5DaGFyKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLnJlbW92ZVBpZWNlKG1vdmUudG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBmZW5DaGFyID0gbW92ZS5jb2xvciA9PT0gXCJiXCIgPyBtb3ZlLnBpZWNlIDogbW92ZS5waWVjZS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQucmVtb3ZlUGllY2UobW92ZS5mcm9tKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmFkZFBpZWNlKGZlbkNoYXIsIG1vdmUudG8pO1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuaGlnaGxpZ2h0VGFyZ2V0KG1vdmUudG8pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1vdmVJbmRleCsrO1xyXG4gICAgfVxyXG4gICAgc3RlcEJhY2soKXtcclxuICAgICAgICBsZXQgbW92ZSA9IHRoaXMubW92ZXNbdGhpcy5jdXJyZW50TW92ZUluZGV4XTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRNb3ZlSW5kZXgtLTtcclxuICAgIH1cclxuICAgIHBsYXkoKXtcclxuXHJcbiAgICB9XHJcbiAgICByZXdpbmQoKXtcclxuXHJcbiAgICB9XHJcbiAgICBnb1RvU3RhcnQoKXtcclxuXHJcbiAgICB9XHJcbiAgICBnb1RvRW5kKCl7XHJcblxyXG4gICAgfVxyXG4gICAgZ29Ub01vdmUoaW5kZXg6bnVtYmVyKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ2hlc3Nib2FyZCBmcm9tIFwiLi4vY2hlc3Nib2FyZC9DaGVzc2JvYXJkXCI7XHJcbmltcG9ydCB7IENhcHR1cmVQaWVjZUZhY3RvcnkgfSBmcm9tIFwiLi9DYXB0dXJlUGllY2VGYWN0b3J5XCI7XHJcbmltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcclxuXHJcbmNvbnN0IHBpZWNlVmFsdWVzOlJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7W1wicFwiXToxLFtcIm5cIl06MyxbXCJiXCJdOjMsW1wiclwiXTo1LFtcInFcIl06OX07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXJJbmZve1xyXG4gICAgcHJpdmF0ZSBjb250YWluZXI6SFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHdoaXRlUGxheWVyOkhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBibGFja1BsYXllcjpIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgd2hpdGVDYXB0dXJlczpSZWNvcmQ8c3RyaW5nLCBIVE1MRWxlbWVudD4gPSB7fTtcclxuICAgIHByaXZhdGUgYmxhY2tDYXB0dXJlczpSZWNvcmQ8c3RyaW5nLCBIVE1MRWxlbWVudD4gPSB7fTtcclxuICAgIHByaXZhdGUgc2NvcmUgPSAwO1xyXG4gICAgcHJpdmF0ZSB3aGl0ZVNjb3JlOkhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBibGFja1Njb3JlOkhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB3aGl0ZVBsYXllck5hbWU6SFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGJsYWNrUGxheWVyTmFtZTpIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6SFRNTEVsZW1lbnQsIGZlbjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmJsYWNrUGxheWVyID0gdGhpcy5hZGRDaGlsZCh0aGlzLmNvbnRhaW5lciwgXCJkaXZcIiwgXCJwbGF5ZXIgYmxhY2sgXCIgKyAoaXNSb3RhdGVkID8gXCJiZWxvd1wiIDogXCJhYm92ZVwiKSk7XHJcbiAgICAgICAgdGhpcy53aGl0ZVBsYXllciA9IHRoaXMuYWRkQ2hpbGQodGhpcy5jb250YWluZXIsIFwiZGl2XCIsIFwicGxheWVyIHdoaXRlIFwiICsgKGlzUm90YXRlZCA/IFwiYWJvdmVcIiA6IFwiYmVsb3dcIikpO1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyQWJvdmVCb2FyZCA9IGlzUm90YXRlZCA/IHRoaXMud2hpdGVQbGF5ZXIgOiB0aGlzLmJsYWNrUGxheWVyO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShwbGF5ZXJBYm92ZUJvYXJkLCB0aGlzLmNvbnRhaW5lci5maXJzdENoaWxkISk7XHJcblxyXG4gICAgICAgIGxldCBibGFja0NhcHR1cmUgPSB0aGlzLmFkZENoaWxkKHRoaXMuYmxhY2tQbGF5ZXIsIFwiZGl2XCIsIFwiY2FwdHVyZXNcIik7XHJcbiAgICAgICAgbGV0IHdoaXRlQ2FwdHVyZSA9IHRoaXMuYWRkQ2hpbGQodGhpcy53aGl0ZVBsYXllciwgXCJkaXZcIiwgXCJjYXB0dXJlc1wiKTtcclxuXHJcbiAgICAgICAgbGV0IHJlY29yZCA9IFt0aGlzLndoaXRlQ2FwdHVyZXMsIHRoaXMuYmxhY2tDYXB0dXJlc107XHJcbiAgICAgICAgW3doaXRlQ2FwdHVyZSwgYmxhY2tDYXB0dXJlXS5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgIFtcInBcIiwgXCJuXCIsIFwiYlwiLCBcInJcIiwgXCJxXCJdLmZvckVhY2godHlwZSA9PntcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuYWRkQ2hpbGQoZWxlbWVudCwgXCJzcGFuXCIsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgcmVjb3JkW2luZGV4XVt0eXBlXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLndoaXRlU2NvcmUgPSB0aGlzLmFkZENoaWxkKHRoaXMud2hpdGVQbGF5ZXIsIFwic3BhblwiLCBcInNjb3JlXCIpO1xyXG4gICAgICAgIHRoaXMuYmxhY2tTY29yZSA9IHRoaXMuYWRkQ2hpbGQodGhpcy5ibGFja1BsYXllciwgXCJzcGFuXCIsIFwic2NvcmVcIik7XHJcbiAgICAgICAgdGhpcy53aGl0ZVBsYXllck5hbWUgPSB0aGlzLmFkZENoaWxkKHRoaXMud2hpdGVQbGF5ZXIsIFwiZGl2XCIsIFwibmFtZVwiLCBcIldoaXRlXCIpO1xyXG4gICAgICAgIHRoaXMuYmxhY2tQbGF5ZXJOYW1lID0gdGhpcy5hZGRDaGlsZCh0aGlzLmJsYWNrUGxheWVyLCBcImRpdlwiLCBcIm5hbWVcIiwgXCJCbGFja1wiKTtcclxuICAgICAgICBpZiAoZmVuKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRTY29yZUFuZENhcHV0ZXJlQnlGZW4oZmVuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBwbGF5ZXJBYm92ZUJvYXJkID0gaXNSb3RhdGVkID8gdGhpcy53aGl0ZVBsYXllciA6IHRoaXMuYmxhY2tQbGF5ZXI7XHJcbiAgICAgICAgbGV0IHBsYXllckJlbG93Qm9hcmQgPSBpc1JvdGF0ZWQgPyB0aGlzLmJsYWNrUGxheWVyIDogdGhpcy53aGl0ZVBsYXllcjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUocGxheWVyQWJvdmVCb2FyZCwgdGhpcy5jb250YWluZXIuZmlyc3RDaGlsZCEpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBsYXllckJlbG93Qm9hcmQpO1xyXG4gICAgICAgIHBsYXllckFib3ZlQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImJlbG93XCIpO1xyXG4gICAgICAgIHBsYXllckJlbG93Qm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImFib3ZlXCIpO1xyXG4gICAgICAgIHBsYXllckFib3ZlQm9hcmQuY2xhc3NMaXN0LmFkZChcImFib3ZlXCIpO1xyXG4gICAgICAgIHBsYXllckJlbG93Qm9hcmQuY2xhc3NMaXN0LmFkZChcImJlbG93XCIpO1xyXG4gICAgfVxyXG4gICAgc2V0U2NvcmUoc2NvcmU6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNjb3JlID0gc2NvcmU7XHJcbiAgICAgICAgbGV0IHdoaXRlUHJlZml4ID0gc2NvcmUgPT09IDAgPyBcIlwiIDogKHNjb3JlID4gMCA/IFwiK1wiIDogXCItXCIpO1xyXG4gICAgICAgIGxldCBibGFja1ByZWZpeCA9IHNjb3JlID09PSAwID8gXCJcIiA6IChzY29yZSA+IDAgPyBcIi1cIiA6IFwiK1wiKTtcclxuICAgICAgICB0aGlzLndoaXRlU2NvcmUuaW5uZXJIVE1MID0gc2NvcmUgPT09IDAgPyBcIlwiIDogKHdoaXRlUHJlZml4ICsgTWF0aC5hYnMoc2NvcmUpKTtcclxuICAgICAgICB0aGlzLmJsYWNrU2NvcmUuaW5uZXJIVE1MID0gc2NvcmUgPT09IDAgPyBcIlwiIDogKGJsYWNrUHJlZml4ICsgTWF0aC5hYnMoc2NvcmUpKTtcclxuICAgIH1cclxuICAgIHNldFBsYXllck5hbWVzKGJsYWNrOnN0cmluZywgd2hpdGU6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmJsYWNrUGxheWVyTmFtZS5pbm5lckhUTUwgPSBibGFjaztcclxuICAgICAgICB0aGlzLndoaXRlUGxheWVyTmFtZS5pbm5lckhUTUwgPSB3aGl0ZTtcclxuICAgIH1cclxuICAgIHNldFNjb3JlQW5kQ2FwdXRlcmVCeUZlbihmZW46c3RyaW5nKXsgICAgIFxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy53aGl0ZUNhcHR1cmVzKS5jb25jYXQoT2JqZWN0LnZhbHVlcyh0aGlzLmJsYWNrQ2FwdHVyZXMpKS5mb3JFYWNoKGVsZW1lbnQgPT57XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNldFNjb3JlKDApO1xyXG4gICAgICAgIGlmIChmZW4gIT09IFwic3RhcnRcIiAmJiBmZW4gIT09IFwiXCIpe1xyXG4gICAgICAgICAgICBsZXQgc3RhbmRpbmcgPSB0aGlzLmNhbGN1bGF0ZVNjb3JlQW5kQ2FwdHVyZXNCeUZlbihmZW4pO1xyXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhzdGFuZGluZy5jYXB0dXJlcykuZm9yRWFjaCgoW2ZlbkNoYXIsIGNvdW50XSkgPT57XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENhcHR1cmUoZmVuQ2hhcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRDYXB0dXJlKGZlbkNoYXI6c3RyaW5nKXtcclxuICAgICAgICBsZXQgcGllY2UgPSBDYXB0dXJlUGllY2VGYWN0b3J5LmdldChmZW5DaGFyKTtcclxuICAgICAgICBsZXQgZmVuQ2hhckxvd2VyQ2FzZSA9IGZlbkNoYXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBsZXQgaXNCbGFjayA9IGZlbkNoYXIgPT09IGZlbkNoYXJMb3dlckNhc2U7XHJcbiAgICAgICAgbGV0IHNwYW4gPSBpc0JsYWNrID8gdGhpcy5ibGFja0NhcHR1cmVzW2ZlbkNoYXJMb3dlckNhc2VdIDogdGhpcy53aGl0ZUNhcHR1cmVzW2ZlbkNoYXJMb3dlckNhc2VdO1xyXG4gICAgICAgIHNwYW4uYXBwZW5kQ2hpbGQocGllY2UpO1xyXG4gICAgICAgIGxldCBwaWVjZVZhbHVlID0gcGllY2VWYWx1ZXNbZmVuQ2hhckxvd2VyQ2FzZV07XHJcbiAgICAgICAgbGV0IG5ld1Njb3JlID0gdGhpcy5zY29yZSArIChpc0JsYWNrID8gLTEgKiBwaWVjZVZhbHVlIDogcGllY2VWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5zZXRTY29yZShuZXdTY29yZSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVDYXB0dXJlKGNvbG9yOnN0cmluZywgY2FwdHVyZWQ6c3RyaW5nKXtcclxuICAgICAgICBsZXQgcGllY2VWYWx1ZSA9IHBpZWNlVmFsdWVzW2NhcHR1cmVkXTtcclxuICAgICAgICBsZXQgbmV3U2NvcmUgPSB0aGlzLnNjb3JlICsgKGNvbG9yID09PSBcImJcIiA/IHBpZWNlVmFsdWUgOiBwaWVjZVZhbHVlICogLTEpO1xyXG4gICAgICAgIHRoaXMuc2V0U2NvcmUobmV3U2NvcmUpO1xyXG4gICAgICAgIHJldHVybiAoY29sb3IgPT09IFwiYlwiID8gdGhpcy5ibGFja0NhcHR1cmVzW2NhcHR1cmVkXS5maXJzdENoaWxkIDogdGhpcy53aGl0ZUNhcHR1cmVzW2NhcHR1cmVkXS5maXJzdENoaWxkKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgY2FsY3VsYXRlU2NvcmVBbmRDYXB0dXJlc0J5RmVuKGZlbjpzdHJpbmcpe1xyXG4gICAgICAgIC8vIGV4YW1wbGU6IFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIlxyXG4gICAgICAgIGZlbiA9IGZlbi5zcGxpdChcIiBcIilbMF0uc3BsaXQoXCIvXCIpLmpvaW4oXCJcIik7XHJcbiAgICAgICAgLy8gbWFrZSBhIHJlY29yZCBvZiBhbGwgdHlwZXMgb2YgcGllY2VzIGFuZCBzZXQgaW5pdGlhbCBjb3VudCB0byB6ZXJvXHJcbiAgICAgICAgbGV0IGZlbkNoYXJzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XHJcbiAgICAgICAgW1wicFwiLFwiblwiLFwiYlwiLFwiclwiLFwicVwiLFwiUFwiLFwiTlwiLFwiQlwiLFwiUlwiLFwiUVwiXS5mb3JFYWNoKGNoYXIgPT57XHJcbiAgICAgICAgICAgIGZlbkNoYXJzW2NoYXJdID0gMDtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjYWxjdWxhdGUgaG93IG1hbnkgcGllY2VzIHdlIGhhdmUgb2YgZWFjaCBraW5kXHJcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIGZlbikge1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4ocGFyc2VJbnQoY2hhcikpKXtcclxuICAgICAgICAgICAgICAgIGZlbkNoYXJzW2NoYXJdICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGlmIHRoZSBzY29yZSBpcyBwb3NpdGl2ZSB3aGl0ZSBpcyBsZWFkaW5nXHJcbiAgICAgICAgbGV0IHNjb3JlID0gZmVuQ2hhcnNbXCJQXCJdIC0gZmVuQ2hhcnNbXCJwXCJdO1xyXG4gICAgICAgIHNjb3JlICs9IChmZW5DaGFyc1tcIk5cIl0gKyBmZW5DaGFyc1tcIkJcIl0gLSBmZW5DaGFyc1tcIm5cIl0gLSBmZW5DaGFyc1tcImJcIl0pICogMztcclxuICAgICAgICBzY29yZSArPSAoZmVuQ2hhcnNbXCJSXCJdIC0gZmVuQ2hhcnNbXCJyXCJdKSAqIDU7XHJcbiAgICAgICAgc2NvcmUgKz0gKGZlbkNoYXJzW1wiUVwiXSAtIGZlbkNoYXJzW1wicVwiXSkgKiA5O1xyXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gcmV0dXJuIGEgc2ltaWxhciByZWNvcmQgc2hvd2luZyBob3cgbWFueSBwaWVjZXMgaGF2ZSBiZWVuIHRha2VuXHJcbiAgICAgICAgbGV0IGNhcHR1cmVzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XHJcbiAgICAgICAgLy8gd2Ugc3RhcnRlZCBoYXZpbmcgMiByb29rcywga25pZ2h0cyBhbmQgYmlzaG9wcy4gV2UgY291bGQgaGF2ZSBtb3JlIGR1ZSB0byBwcm9tb3Rpb25cclxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgW1wiclwiLCBcIm5cIiwgXCJiXCIsIFwiUlwiLCBcIk5cIiwgXCJCXCJdKXtcclxuICAgICAgICAgICAgY2FwdHVyZXNbY2hhcl0gPSBmZW5DaGFyc1tjaGFyXSA+PSAyID8gMCA6IDIgLSBmZW5DaGFyc1tjaGFyXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIFtcInFcIiwgXCJRXCJdKXtcclxuICAgICAgICAgICAgY2FwdHVyZXNbY2hhcl0gPSBmZW5DaGFyc1tjaGFyXSA+IDAgPyAwIDogMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ291bnRpbmcgdGFrZW4gcGF3bnMgaXMgZGlmZmljdWx0IGR1ZSB0byBwb3NzaWJsZSBwcm9tb3Rpb25cclxuICAgICAgICBsZXQgYmxhY2sgPSB7cGF3bjpcInBcIiwgcXVlZW46IFwicVwiLCBwaWVjZXM6W1wiclwiLCBcIm5cIiwgXCJiXCJdfTtcclxuICAgICAgICBsZXQgd2hpdGUgPSB7cGF3bjpcIlBcIiwgcXVlZW46IFwiUVwiLCBwaWVjZXM6W1wiUlwiLCBcIk5cIiwgXCJCXCJdfTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiBbYmxhY2ssIHdoaXRlXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhcHR1cmVzW3BsYXllci5wYXduXSA9IDggLSBmZW5DaGFyc1twbGF5ZXIucGF3bl07XHJcbiAgICAgICAgICAgIGlmIChmZW5DaGFyc1twbGF5ZXIucXVlZW5dID4gMSl7XHJcbiAgICAgICAgICAgICAgICBjYXB0dXJlc1twbGF5ZXIucGF3bl0gLT0gZmVuQ2hhcnNbcGxheWVyLnF1ZWVuXSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpZWNlIG9mIHBsYXllci5waWVjZXMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGZlbkNoYXJzW3BpZWNlXSA+IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmVzW3BsYXllci5wYXduXSAtPSBmZW5DaGFyc1twaWVjZV0gLTI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtzY29yZSwgY2FwdHVyZXN9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZENoaWxkKHBhcmVudDpIVE1MRWxlbWVudCwgdGFnOnN0cmluZywgY2xhc3NOYW1lOnN0cmluZywgdGV4dD86c3RyaW5nKXtcclxuICAgICAgICBsZXQgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICAgICAgY2hpbGQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgICAgIGlmICh0ZXh0KVxyXG4gICAgICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFwiLi9vcGVuaW5ncy5jc3NcIjtcclxuaW1wb3J0IENoZXNzYm9hcmQgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9DaGVzc2JvYXJkXCI7XHJcbmltcG9ydCBHYW1lQnJvd3NlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy92Mi9nYW1lQnJvd3Nlci9HYW1lQnJvd3NlclwiO1xyXG5pbXBvcnQgQ2hlc3NnYW1lIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3YyL2NoZXNzZ2FtZS9DaGVzc2dhbWVcIjtcclxuaW1wb3J0IHsgQ2hlc3MsIE1vdmUgfSBmcm9tIFwiY2hlc3MuanNcIjtcclxuaW1wb3J0ICogYXMganNvbiBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jaGVzcy9hc3NldHMvZGF0YS9nYW1lcy5qc29uXCI7XHJcblxyXG4vLyBsZXQgYm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZXNzYm9hcmRcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbi8vIGxldCBjaGVzc2JvYXJkID0gbmV3IENoZXNzYm9hcmQoYm9hcmRDb250YWluZXIsIFwic3RhcnRcIiwgZmFsc2UpO1xyXG5cclxuLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXN0XCIpIS5vbmNsaWNrID0gKCkgPT4gY2hlc3Nib2FyZC50ZXN0KCk7XHJcbi8vIGxldCBmID1cInI3LzNxcDFrMS8xcDFwMXBQMS9wMW5QMVAyL1BuUDUvNEIzLzRCMy8xUTNLMiB3IC0gLSAxIDI4XCI7XHJcbmxldCBmZW4gPSBcIjgva3BQSzQvOC84LzgvOC84LzhcIjtcclxubGV0IGJyb3dzZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVCcm93c2VyXCIpIGFzIEhUTUxFbGVtZW50O1xyXG5sZXQgZ2FtZUJyb3dzZXIgPSBuZXcgR2FtZUJyb3dzZXIoYnJvd3NlckNvbnRhaW5lciwgZmVuLCBmYWxzZSk7XHJcbmxldCBjaGVzcyA9IG5ldyBDaGVzcygpO1xyXG5jaGVzcy5sb2FkUGduKGpzb24uZ2FtZXNbMF0ubW92ZVRleHQpO1xyXG5sZXQgbW92ZXMgPSBjaGVzcy5oaXN0b3J5KHt2ZXJib3NlOnRydWV9KTtcclxuZ2FtZUJyb3dzZXIubG9hZEdhbWUoe3doaXRlUGxheWVyOlwiV2hpdGUgcGxheWVyXCIsIGJsYWNrUGxheWVyOlwiQmxhY2sgcGxheWVyXCIsIG1vdmVzfSk7XHJcblxyXG4vLyBsZXQgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlc3NnYW1lXCIpIGFzIEhUTUxFbGVtZW50O1xyXG4vLyBsZXQgY2hlc3NnYW1lID0gbmV3IENoZXNzZ2FtZShnYW1lQ29udGFpbmVyLCBcInN0YXJ0XCIsIGZhbHNlKTtcclxuXHJcbmxldCB0ZXN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3RhdGVcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbnRlc3RCdXR0b24ub25jbGljayA9ICgpID0+IHtnYW1lQnJvd3Nlci5zdGVwRm9yd2FyZCgpfTtcclxuXHJcbi8vIGxldCBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15LWltZ1wiKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4vLyBpbWcuc3JjID0gYm9hcmQyO1xyXG4vLyBsZXQgc3ZnID0gY3JlYXRlQmFja2dyb3VuZCgpO1xyXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZChzdmcpO1xyXG4vLyBkZWJ1Z2dlcjtcclxuXHJcbi8vIHNldFRhcmdldEFuZFNvdXJjZShcImUyXCIsIFwiZTRcIiwgc3ZnKTtcclxuXHJcbi8vIGxldCBib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmRcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbi8vIGxldCBzdmcgPSBib2FyZC5maXJzdENoaWxkIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbi8vIHN2Zy5zcmMgPSBib2FyZGJnO1xyXG4vLyBmb3IgKGxldCBlbGVtZW50IG9mIGJvYXJkLmNoaWxkcmVuKXtcclxuLy8gICAgIGlmICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJiYWNrZ3JvdW5kXCIpKXtcclxuLy8gICAgICAgICBsZXQgaW1hZ2UgPSBlbGVtZW50Lmxhc3RDaGlsZCBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4vLyAgICAgICAgIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3cFwiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiUFwiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid3JcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIlJcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcInduXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJOXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3YlwiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiQlwiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid3FcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIlFcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcIndrXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJLXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuICAgIFxyXG4vLyB9XHJcbi8vIGxldCBxdWVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lTlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcIipcIilbNjhdO1xyXG4vLyBsZXQgYmJveCA9IGtpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbi8vIGNvbnNvbGUubG9nKGJib3gpO1xyXG5cclxuLy8gbGV0IHN2Z1RhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN2Z1wiKSBhcyBIVE1MQ29sbGVjdGlvbk9mPFNWR0VsZW1lbnQ+O1xyXG4vLyBsZXQgcXVlZW4gPSBzdmdUYWdzWzFdIGFzIFNWR0VsZW1lbnQ7XHJcbi8vIGdldEJvdW5kaW5nQm94T2ZTdmdQYXRoKHF1ZWVuKTtcclxuXHJcbi8vIGltcG9ydCBcIi4uL21hc3Rlci5jc3NcIjtcclxuLy8gaW1wb3J0IHsgQ2hlc3Nib2FyZCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2NoZXNzL0NoZXNzYm9hcmRcIjtcclxuXHJcbi8vIGxldCBjaGVzc2JvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVzc2JvYXJkXCIpIGFzIEhUTUxFbGVtZW50O1xyXG4vLyBsZXQgY2hlc3Nib2FyZCA9IG5ldyBDaGVzc2JvYXJkKGNoZXNzYm9hcmRDb250YWluZXIsIFwic3RhcnRcIiwgZmFsc2UpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==