export type Marker = "X" | "O"

export interface Board {
    rowCount: number
    columnCount: number
    columns: Marker[][]
}

export function makeBoard(
    rows: number,
    columns: number,
    initial: Marker[][] = Array.from({ length: columns }, () => [])
): Board {
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

    if (marker !== "X" && marker !== "O") {
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
        const row = board.columns.map((col) => col[r])
        rows.push(row)
    }
    return rows
}

function getDiagonals(
    board: Board,
    matrix: Marker[][] = board.columns,
    height = board.rowCount,
    width = board.columnCount
): Marker[][] {
    const diagonals: Marker[][] = []

    // for each column, check the "up and to the right"
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
        const diagonal: Marker[] = []

        // up-to-the-right, starting from the bottom left and going to bottom right, i.e. moving along columns
        for (
            let rowOffset = 0, columnOffset = 0;
            rowOffset < height && columnIndex + columnOffset < width;
            rowOffset++, columnOffset++
        ) {
            diagonal.push(matrix[columnIndex + columnOffset]?.[rowOffset])
        }

        diagonals.push(diagonal)
    }

    // for each row (ignoring bottom left as it was already covered), check the "up and to the right"
    for (let rowIndex = 1; rowIndex < height; rowIndex++) {
        const diagonal: Marker[] = []

        // up-to-the-right, starting from the bottom left and going to bottom right, i.e. moving along columns
        for (
            let rowOffset = 0, columnOffset = 0;
            rowIndex + rowOffset < height && columnOffset < width;
            rowOffset++, columnOffset++
        ) {
            diagonal.push(matrix[columnOffset]?.[rowIndex + rowOffset])
        }

        diagonals.push(diagonal)
    }

    return diagonals
}

function getDownwardDiagonals(
    board: Board,
    matrix: Marker[][] = board.columns,
    height = board.rowCount,
    width = board.columnCount
): Marker[][] {
    const diagonals: Marker[][] = []

    // for each column, check the "down and to the right"
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
        const diagonal: Marker[] = []

        // down-to-the-right, starting from the top left and going to top right, i.e. moving along columns
        for (
            let rowOffset = height - 1, columnOffset = 0;
            rowOffset >= 0 && columnIndex + columnOffset < width;
            rowOffset--, columnOffset++
        ) {
            diagonal.push(matrix[columnIndex + columnOffset]?.[rowOffset])
        }

        diagonals.push(diagonal)
    }

    // for each row (ignoring top row as it was already covered), check the "down and to the right"
    for (let rowIndex = height - 2; rowIndex >= 0; rowIndex--) {
        const diagonal: Marker[] = []

        // down-to-the-right, starting from the top left and going to top right, i.e. moving along columns
        for (
            let rowOffset = 0, columnOffset = 0;
            rowIndex + rowOffset >= 0 && columnOffset < width;
            rowOffset--, columnOffset++
        ) {
            diagonal.push(matrix[columnOffset]?.[rowIndex + rowOffset])
        }

        diagonals.push(diagonal)
    }

    return diagonals
}

function checkRows(board: Board): Marker | null {
    const rows = getRows(board)
    for (const row of rows) {
        if (row.join(",").includes("X,X,X,X")) return "X"
        if (row.join(",").includes("O,O,O,O")) return "O"
    }
    return null
}

function checkColumns(board: Board): Marker | null {
    const columns = getColumns(board)
    for (const column of columns) {
        if (column.join(",").includes("X,X,X,X")) return "X"
        if (column.join(",").includes("O,O,O,O")) return "O"
    }
    return null
}

function checkDiagonals(board: Board): Marker | null {
    const diagonals = getDiagonals(board)
    for (const diagonal of diagonals) {
        if (diagonal.join(",").includes("X,X,X,X")) return "X"
        if (diagonal.join(",").includes("O,O,O,O")) return "O"
    }

    const downwardDiagonals = getDownwardDiagonals(board)
    for (const diagonal of downwardDiagonals) {
        if (diagonal.join(",").includes("X,X,X,X")) return "X"
        if (diagonal.join(",").includes("O,O,O,O")) return "O"
    }
    return null
}
