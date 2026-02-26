{
  description = "aMIQ este o interfață pentru jocuri de loĝică similar ĉelor televizate";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    esp = {
        url = "github:mirrexagon/nixpkgs-esp-dev";
    };
  };

  outputs = { self, nixpkgs, esp }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
        inherit system;
        overlays = [ esp.overlays.default ];
    };
  in {

      devShells.${system} = {
          default = import ./shell.nix {inherit pkgs;};
          esp = import ./esp-idf-full.nix {inherit pkgs;};
      };

      formatter.${system} = pkgs.alejandra;
  };
}
