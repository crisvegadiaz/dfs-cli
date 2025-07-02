import chalk from "chalk";

export default function superusuario() {
  if (process.getuid() !== 0) {
    console.error(
      chalk.red.bold(
        ">>>   Error: Este comando requiere permisos de superusuario."
      )
    );
    console.warn(
      chalk.yellow.bold(">>>   Por favor, ejecuta el comando con 'sudo'. \n")
    );

    process.exit(1);
  }
}
