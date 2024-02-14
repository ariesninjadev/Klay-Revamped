{ pkgs }: {
    deps = [
      pkgs.unixtools.ping
        pkgs.nodejs-16_x
        pkgs.cowsay
    ];
}