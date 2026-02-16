{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-25.11.tar.gz") {} }: 

with pkgs; mkShell {
  buildInputs = [
    htmlq

    bun
    nodejs
    # nodejs_22
  ];

  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"
  '';
}
