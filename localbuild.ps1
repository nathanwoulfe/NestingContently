rm -r -force __out
mkdir __out
dotnet pack -c Debug -o __out --no-restore