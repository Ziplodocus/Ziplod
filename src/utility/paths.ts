
import { rootDir } from "../ziplod.js";
import { readdirSync } from "fs";
import { join as joinPath, relative as relativePath } from "path";


/////////////////////////
//      FUNCTIONS      //
/////////////////////////

export function pathTo( to: string, from = rootDir ) {
	return joinPath( from, to );
}
export function relPathTo( to: string ) {
	const toPath = pathTo( to );
	return relativePath( ".", toPath );
}

// Retrieves all directories within the given directory
export function getDirs( dirPath: string ) {
	return readdirSync( dirPath, { withFileTypes: true } )
		.filter( ( dirent ) => dirent.isDirectory() )
		.map( ( dirent ) => dirent.name );
}