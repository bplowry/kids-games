export type Marker = "X" | "O"

export interface Board {
    rowCount: number
    columnCount: number
    columns: Marker[][]
}

export function makeBoard(rows: number, columns: number, initial: Marker[][] = Array.from({length: columns}, () => [])): Board {
    return {
        rowCount: rows,
        columnCount: columns,
        columns: initial,
    }
}

export function place(columnIndex: number, marker: Marker, board: Board): false | Board {
    if (!board) {
        // no board?
        return false
    }

    if (columnIndex < 0 || columnIndex >= board.columnCount) {
        // out of bounds
        return false
    }

    const column = board.columns[columnIndex]
    if (!column) {
        return false
    }
    if (column.length === board.rowCount) {
        // column is full, so no change
        return false
    }

    if (marker !== 'X' && marker !== 'O') {
        // invalid marker
        return false
    }

    column.push(marker)

    return board
}

export function checkWinner(board: Board): Marker | null {
    return checkColumns(board) || checkRows(board) || checkDiagonals(board)
}

function getColumns(board: Board): Marker[][] {
    return board.columns
}

export function getRows(board: Board): Marker[][] {
    const rows = []
    for (let r = 0; r < board.rowCount; r++) {
        const row = board.columns.map(col => col[r])
        rows.push(row)
    }
    return rows;
}

function checkRows(board: Board): Marker | null {
    const rows = getRows(board)
    for (const row of rows) {
        if (row.join('').includes("XXXX")) return 'X'
        if (row.join('').includes("OOOO")) return 'O'
    }
    return null
}

function checkColumns(board: Board): Marker | null {
    const columnd = getColumns(board)
    for (const column of columnd) {
        if (column.join('').includes("XXXX")) return 'X'
        if (column.join('').includes("OOOO")) return 'O'
    }
    return null
}

function checkDiagonals(board: Board): Marker | null {
    // TODO
    if (!board) return null

    return null
}

